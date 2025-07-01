import { routeIndexFront } from "@/utils/routes/routesFront";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const fetchUsersDomain = async (): Promise<User[]> => {
  const response = await fetch(routeIndexFront + "/api/user");
  return response.json();
};

export function useQueryUsersDomain() {
  const query = useQuery({
    queryKey: ["usersDomain"],
    queryFn: fetchUsersDomain,
  });

  return query;
}
