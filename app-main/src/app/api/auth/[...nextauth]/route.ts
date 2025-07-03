import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import sendMail from "@/services/mail/sendMail";
import sendTokenSessionMailContent from "@/services/mail/templates/sendTokenSession";

const prisma = new PrismaClient();

async function sendVerificationRequest(params: any) {
  const { identifier, url, provider } = params;
  const { host } = new URL(url);
  
  const { text, html } = sendTokenSessionMailContent({ url, host });
  const subject = `${process.env.NEXT_PUBLIC_APP_NAME} | Votre lien de connection`;
  
  try {
    await sendMail({
      provider,
      identifier,
      host,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.MAILTRAP_HOST,
        port: parseInt(process.env.MAILTRAP_PORT || "587"),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params) {
        await sendVerificationRequest(params);
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, email }) {
      const userExists = await prisma.user.findUnique({
        where: { email: user.email ?? "" }, //the user object has an email property, which contains the email the user entered.
      });
      if (userExists) {
        return true; //if the email exists in the User collection, email them a magic login link
      } else {
        return true;
      }
    },
    async session({ session, user }) {
      if (session?.user) {
        const userData = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, domainId: true, role: true },
        });

        const domain = await prisma.domain.findUnique({
          where: { id: userData?.domainId },
          select: {
            id: true,
            name: true,
            url: true,
          },
        });
        session.user.domainId = userData?.domainId;
        session.user.domainName = domain?.name;
        session.user.domainUrl = domain?.url;
        session.user.id = userData?.id;
        session.user.role = userData?.role;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
