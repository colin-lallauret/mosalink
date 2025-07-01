import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUser";

const fetchBookmarksTags = async (name: string): Promise<BookmarkData[]> => {
  const response = await fetch(`${routeIndexFront}/api/bookmark/tag/${name}`);
  return response.json();
};

export function useQueryBookmarksTags(name: string) {
  const query = useQuery({
    queryKey: ["bookmarksTagsDomain"],
    queryFn: () => fetchBookmarksTags(name),
  });

  return query;
}
