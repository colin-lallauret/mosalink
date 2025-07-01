import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  routeCategorieFront,
  routeUserFront,
} from "@/utils/routes/routesFront";
import { Category } from "@prisma/client";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MyProjets from "../../Folder/Dialog/MyProjets";

interface Props {
  domain: string;
  categories: Category[];
}

const Navigation = ({ domain, categories }: Props) => {
  const { data: dataSession } = useSession();
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1 flex-col-reverse items-start md:items-center md:gap-0 md:flex-row">
        {categories.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Mes Catégories</NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-col gap-2 p-2">
              {categories?.map((categorie) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  key={categorie.id}
                  href={routeCategorieFront(domain, categorie.url)}
                >
                  {categorie.name}
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
        <Link
          href={routeUserFront(domain, dataSession?.user.id)}
          legacyBehavior
          passHref
        >
          <NavigationMenuItem
            className={`${navigationMenuTriggerStyle()} cursor-pointer`}
          >
            Mon tableau
          </NavigationMenuItem>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <NavigationMenuItem
              className={`${navigationMenuTriggerStyle()} cursor-pointer`}
            >
              Mes projets
            </NavigationMenuItem>
          </DialogTrigger>
          <MyProjets />
        </Dialog>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
