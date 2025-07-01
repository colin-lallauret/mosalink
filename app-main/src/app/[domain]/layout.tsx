import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { routeDomainFront } from "@/utils/routes/routesFront";
import Header from "@/components/specific/Header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Footer from "@/components/specific/Footer";

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

  if (session.user.domainUrl !== params.domain) {
    return redirect(routeDomainFront(session.user.domainUrl));
  }
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
