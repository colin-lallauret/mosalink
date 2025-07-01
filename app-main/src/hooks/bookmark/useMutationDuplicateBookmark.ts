import { useToast } from "@/components/ui/use-toast";
import { routeIndexFront } from "@/utils/routes/routesFront";
import { Bookmark, Category, Role } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const duplicateBookmark = async (bookmarkId: string) => {
  const response = await fetch(routeIndexFront + "/api/bookmark/duplicate", {
    method: "POST",
    body: JSON.stringify({
      bookmarkId,
    }),
  });
};

export function useMutationDuplicateBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDuplicateBookmarkMutation = async (bookmarkId: string) => {
    try {
      const response = await duplicateBookmark(bookmarkId);
      return;
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de la duplication du bookmark."
      );
    }
  };
  const mutation = useMutation(createDuplicateBookmarkMutation, {
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la duplication du bookmark.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Félicitations",
        description: "Le bookmark a bien été dupliqué.",
      });
      queryClient.refetchQueries(["bookmarksDomain"]);
    },
  });

  return mutation;
}
