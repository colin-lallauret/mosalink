import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { routeDomainFront } from "@/utils/routes/routesFront";
import Header from "@/components/specific/Header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Footer from "@/components/specific/Footer";
import prisma from "../../../lib/prisma";

export interface ParamsDomainRoute {
  params: {
    domain: string;
  };
}

interface Props extends ParamsDomainRoute {
  children: React.ReactNode;
}

export default async function Layout({ children, params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  const requestedDomain = await prisma.domain.findFirst({
    where: { 
      url: params.domain,
      isPublish: true,
      users: {
        some: {
          id: session.user.id
        }
      }
    }
  });

  if (!requestedDomain) {
    return redirect("/");
  }

  return (
    <div>
      <Header currentDomain={requestedDomain} />
      {children}
      <Footer />
    </div>
  );
}
