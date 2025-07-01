"use client";

import BookmarkCard from "../../Bookmark/BookmarkCard";
import Board from "..";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useQueryBookmarksDomain } from "@/hooks/bookmark/useQueryBookmarksDomain";
import TitleBoard from "../TitleBoard";
import BookmarkBoard from "../BookmarkBoard";

interface Props {
  id: string;
  titleBoard?: string;
}

const DomainBoard = ({ id, titleBoard }: Props) => {
  const { data: bookmarks, isLoading, isError } = useQueryBookmarksDomain();
  const { data: session } = useSession();

  if (isError) {
    return <p className="text-center text-red-500">Une erreur est survenue</p>;
  }

  return (
    <Board>
      <TitleBoard>{session?.user.domainName}</TitleBoard>
      <BookmarkBoard bookmarks={bookmarks ?? []} isLoading={isLoading} />
    </Board>
  );
};

export default DomainBoard;
