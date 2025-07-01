"use client";

import { useSession } from "next-auth/react";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import { useQueryCategoriesDomain } from "@/hooks/useCategory";

const Header = () => {
  const { data: dataSession } = useSession();

  const domainName = dataSession?.user.domainName;
  const domainUrl = dataSession?.user.domainUrl;

  const { data: allCategories } = useQueryCategoriesDomain();

  return (
    <header className="w-full sticky top-0 left-0 px-4">
      <HeaderDesktop
        domainUrl={domainUrl}
        domainName={domainName}
        allCategories={allCategories}
      />
      <HeaderMobile
        domainUrl={domainUrl}
        domainName={domainName}
        allCategories={allCategories}
      />
    </header>
  );
};

export default Header;
