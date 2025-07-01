import { routeIndexFront } from "@/utils/routes/routesFront";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const fetchCategoriesDomain = async (): Promise<Category[]> => {
  const response = await fetch(routeIndexFront + "/api/category");
  return response.json();
};

export function useQueryCategoriesDomain() {
  const query = useQuery({
    queryKey: ["categoriesDomain"],
    queryFn: fetchCategoriesDomain,
  });

  return query;
}
