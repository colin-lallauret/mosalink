import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryAddUserToFolder {
  userId: string;
  folderId: string;
}

const deleteUserToFolder = async (folder: QueryAddUserToFolder) => {
  const response = await fetch(routeIndexFront + "/api/folder/user", {
    method: "DELETE",
    body: JSON.stringify({
      userId: folder.userId,
      folderId: folder.folderId,
    }),
  });
};

export function useMutationDeleteUserToFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteUserToFolderMutation = async (folder: QueryAddUserToFolder) => {
    try {
      const response = await deleteUserToFolder(folder);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la suppression d'un utilisateur dans un dossier."
      );
    }
  };

  const mutation = useMutation(deleteUserToFolderMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression d'un utilisateur dans un dossier.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le utilisateur à bien été supprimé du dossier.",
      });
      queryClient.refetchQueries(["foldersUser"]);
      queryClient.refetchQueries(["bookmarksFolderDomain"]);
    },
  });

  return mutation;
}
