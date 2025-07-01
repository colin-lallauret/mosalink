import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUser";

const fetchBookmarksCategories = async (
  id: string
): Promise<BookmarkData[]> => {
  const response = await fetch(
    `${routeIndexFront}/api/bookmark/category/${id}`
  );
  return response.json();
};

export function useQueryBookmarksCategories(id: string) {
  const query = useQuery({
    queryKey: ["bookmarksCategoryDomain"],
    queryFn: () => fetchBookmarksCategories(id),
  });

  return query;
}
