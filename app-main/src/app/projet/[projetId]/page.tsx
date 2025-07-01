"use client";

import FolderBoard from "@/components/specific/Board/FolderBoard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryBookmarksFolder } from "@/hooks/bookmark/useQueryBookmarksFolder";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { redirect } from "next/navigation";

interface Props {
  params: {
    projetId: string;
  };
}

const Page = ({ params }: Props) => {
  const { data: folder, isLoading } = useQueryBookmarksFolder(params.projetId);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!folder?.isPublish) {
    redirect(routeIndexFront);
  }

  return (
    <div>
      <div className="sticky top-0 left-0 w-full p-4 bg-accent">
        <p className="text-center">
          Présenté par {process.env.NEXT_PUBLIC_APP_NAME}
        </p>
      </div>
      <FolderBoard id={params.projetId} isFolderPublic={true} />
    </div>
  );
};

export default Page;
