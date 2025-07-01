import { routeIndexFront } from "@/utils/routes/routesFront";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const fetchCategoriesDomain = async (domain: string): Promise<Category[]> => {
  const response = await fetch(`${routeIndexFront}/api/domain/${domain}/categories`);
  return response.json();
};

export function useQueryCategoriesDomain(domain: string) {
  const query = useQuery({
    queryKey: ["categoriesDomain", domain],
    queryFn: () => fetchCategoriesDomain(domain),
    enabled: !!domain,
  });

  return query;
}
