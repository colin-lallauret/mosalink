import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveAdminData {
  domainId: string;
  userId: string;
}

export function useMutationRemoveDomainAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, userId }: RemoveAdminData) => {
      const response = await fetch(`/api/super-admin/domains/${domainId}/admins`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression de l'administrateur");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-domains"] });
    },
  });
}
