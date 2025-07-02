import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutationAddBookmarkToFolder } from "@/hooks/folder/useMutationAddBookmarkToFolder";
import { useQueryFoldersUser } from "@/hooks/folder/useQueryFoldersUser";
import { Folder } from "lucide-react";
import { Dispatch, SetStateAction, useCallback } from "react";

interface Props {
  bookmarkId: string;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const AddBookmarkInFolder = ({ bookmarkId, setOpenDialog }: Props) => {
  const { data } = useQueryFoldersUser();
  const addBookmarkToFolderMutation = useMutationAddBookmarkToFolder();

  const handleAddBookmarkToFolder = useCallback(
    (folderId: string) => {
      addBookmarkToFolderMutation.mutate({
        folderId,
        bookmarkId,
      });
      setOpenDialog(false);
    },
    [addBookmarkToFolderMutation, bookmarkId, setOpenDialog]
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter à un projet</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <div className="w-full flex flex-col gap-4 py-4">
          {data?.map((folder) => {
            if (
              folder.bookmarks.find((bookmark) => bookmark.id === bookmarkId)
            ) {
              return null;
            }
            return (
              <Button
                variant={"secondary"}
                key={folder.id}
                className="flex gap-4"
                onClick={() => handleAddBookmarkToFolder(folder.id)}
              >
                <Folder className="w-4 h-4" />
                {folder.name}
              </Button>
            );
          })}
        </div>
      </DialogDescription>
    </>
  );
};

export default AddBookmarkInFolder;
