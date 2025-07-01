"use client";

import Board from "..";
import { useQueryBookmarksTags } from "@/hooks/bookmark/useQueryBookmarksTags";
import TitleBoard from "../TitleBoard";
import BookmarkBoard from "../BookmarkBoard";

interface Props {
  id: string;
}

const TagBoard = ({ id }: Props) => {
  const { data: bookmarks, isLoading, isError } = useQueryBookmarksTags(id);

  if (isError) {
    return <p className="text-center text-red-500">Une erreur est survenue</p>;
  }

  return (
    <Board>
      <TitleBoard className="border">{id}</TitleBoard>
      <BookmarkBoard bookmarks={bookmarks ?? []} isLoading={isLoading} />
    </Board>
  );
};

export default TagBoard;
