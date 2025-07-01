import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import DomainBoard from "@/components/specific/Board/DomainBoard";

const Page = async () => {
  const session = await getServerSession(authOptions);

  return <DomainBoard id={session?.user.id} />;
};

export default Page;
