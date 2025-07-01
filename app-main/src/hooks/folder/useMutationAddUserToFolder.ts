import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryAddUserToFolder {
  userId: string;
  folderId: string;
}

const addUserToFolder = async (folder: QueryAddUserToFolder) => {
  const response = await fetch(routeIndexFront + "/api/folder/user", {
    method: "POST",
    body: JSON.stringify({
      userId: folder.userId,
      folderId: folder.folderId,
    }),
  });
};

export function useMutationAddUserToFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addUserToFolderMutation = async (folder: QueryAddUserToFolder) => {
    try {
      const response = await addUserToFolder(folder);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de l'ajout d'un utilisateur dans un dossier."
      );
    }
  };

  const mutation = useMutation(addUserToFolderMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'ajout d'un utilisateur dans un dossier.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "L'utilisateur à bien été ajouté au dossier.",
      });
      queryClient.refetchQueries(["foldersUser"]);
      queryClient.refetchQueries(["usersDomain"]);
      queryClient.refetchQueries(["bookmarksFolderDomain"]);
    },
  });

  return mutation;
}
