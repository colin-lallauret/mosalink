import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryBookmarksFolder } from "@/hooks/bookmark/useQueryBookmarksFolder";
import { useMutationAddUserToFolder } from "@/hooks/folder/useMutationAddUserToFolder";
import { useMutationDeleteUserToFolder } from "@/hooks/folder/useMutationDeleteUserToFolder";
import { useQueryUsersDomain } from "@/hooks/user/useQueryUsersDomain";
import { useCallback } from "react";

interface Props {
  folderId: string;
}

const UserProjet = ({ folderId }: Props) => {
  const {
    data: dataProjet,
    isLoading: isLoadingProjet,
    isError: isErrorProjet,
  } = useQueryBookmarksFolder(folderId);
  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQueryUsersDomain();
  const addUserToFolderMutation = useMutationAddUserToFolder();
  const deleteUserToFolderMutation = useMutationDeleteUserToFolder();

  const handleDeleteUser = useCallback(
    (userId: string) => {
      deleteUserToFolderMutation.mutate({
        folderId,
        userId,
      });
    },
    [deleteUserToFolderMutation, folderId]
  );

  const handleAddUserToFolder = useCallback(
    (userId: string) => {
      addUserToFolderMutation.mutate({
        folderId,
        userId,
      });
    },
    [addUserToFolderMutation, folderId]
  );

  if (isLoadingProjet || isLoadingUser) {
    return null;
  }

  if (isErrorProjet || isErrorUser) {
    return null;
  }

  if (!dataProjet || !dataUser) {
    return null;
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Projet {dataProjet?.name}</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <div className="flex flex-col gap-2 py-4">
          <p className="text-md text-slate-900 font-bold">
            Les membres du groupe
          </p>
          {dataProjet.users?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-2"
            >
              <p>{user.email ?? " "}</p>
              <Button
                variant={"link"}
                className="text-red-500 text-sm font-bold cursor-pointer"
                onClick={() => handleDeleteUser(user.id)}
              >
                Supprimer
              </Button>
            </div>
          ))}
          <div className="flex flex-col gap-4 py-4">
            <p className="text-md text-slate-900 font-bold">
              Ajouter un nouveau membre
            </p>
            {dataUser.map((user) => {
              if (
                dataProjet.users?.find(
                  (userFolder) => userFolder.id === user.id
                )
              ) {
                return null;
              }
              return (
                <Button
                  variant={"secondary"}
                  key={user.id}
                  className="flex items-center justify-between gap-2"
                  onClick={() => handleAddUserToFolder(user.id)}
                >
                  {user.email}
                </Button>
              );
            })}
          </div>
        </div>
      </DialogDescription>
    </DialogContent>
  );
};

export default UserProjet;
