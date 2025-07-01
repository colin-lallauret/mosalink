import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface QueryCreateFolder {
  name: string;
  url: string;
}

const createFolder = async (folder: QueryCreateFolder) => {
  const response = await fetch(routeIndexFront + "/api/folder", {
    method: "POST",
    body: JSON.stringify({
      name: folder.name,
      url: folder.url,
    }),
  });
};

export function useMutationCreateFolder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createFolderMutation = async (folder: QueryCreateFolder) => {
    try {
      const response = await createFolder(folder);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la création du dossier."
      );
    }
  };

  const mutation = useMutation(createFolderMutation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["foldersUser"]);
      toast({
        title: "Félicitations",
        description: "Le dossier a bien été créé.",
      });
    },
  });

  return mutation;
}
