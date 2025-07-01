import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { BookmarkData } from "./useQueryBookmarksUser";

const fetchBookmarksDomain = async (): Promise<BookmarkData[]> => {
  const response = await fetch(`${routeIndexFront}/api/bookmark/`);
  return response.json();
};

export function useQueryBookmarksDomain() {
  const query = useQuery({
    queryKey: ["bookmarksDomain"],
    queryFn: () => fetchBookmarksDomain(),
  });

  return query;
}
