"use client";

import { useQueryBookmarksUser } from "@/hooks/bookmark/useQueryBookmarksUser";
import BookmarkCard from "../../Bookmark/BookmarkCard";
import Board from "..";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryBookmarksCategories } from "@/hooks/bookmark/useQueryBookmarksCategories";
import { useQueryCategoriesDomain } from "@/hooks/useCategory";
import { useMemo } from "react";
import TitleBoard from "../TitleBoard";
import BookmarkBoard from "../BookmarkBoard";

interface Props {
  id: string;
  domain: string;
}

const CategoryBoard = ({ id, domain }: Props) => {
  const {
    data: bookmarks,
    isLoading,
    isError,
  } = useQueryBookmarksCategories(id);
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQueryCategoriesDomain(domain);

  const titleContent = useMemo(() => {
    if (isLoadingCategories) {
      return <Skeleton className="h-8 w-64" />;
    }

    if (isErrorCategories) {
      return "Une erreur est survenue";
    }

    const category = categories?.find((category) => {
      return category.url === id;
    });

    if (!category) {
      ("La categorie n'existe pas");
    }

    return category?.name ?? "";
  }, [categories, id, isErrorCategories, isLoadingCategories]);

  if (isError) {
    return <p className="text-center text-red-500">Une erreur est survenue</p>;
  }

  return (
    <Board>
      <TitleBoard className="bg-slate-100">{titleContent}</TitleBoard>
      <BookmarkBoard bookmarks={bookmarks ?? []} isLoading={isLoading} />
    </Board>
  );
};

export default CategoryBoard;
