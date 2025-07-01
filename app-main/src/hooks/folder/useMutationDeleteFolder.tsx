import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteFolder = async (folderId: string) => {
  const response = await fetch(routeIndexFront + `/api/folder/${folderId}`, {
    method: "DELETE",
  });
};

export function useMutationDeleteFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteFolderMutation = async (folderId: string) => {
    try {
      const response = await deleteFolder(folderId);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la suppression du groupe."
      );
    }
  };

  const mutation = useMutation(deleteFolderMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression du groupe.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le groupe a bien été supprimé.",
      });
      queryClient.refetchQueries(["foldersUser"]);
    },
  });

  return mutation;
}
