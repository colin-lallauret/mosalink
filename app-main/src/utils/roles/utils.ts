import { Role } from "@prisma/client";
import { Session } from "next-auth";

export function isSuperAdmin(user: { role: Role }) {
  if (user.role === Role.SUPER_ADMIN) {
    return true;
  }
  return false;
}

export function isAdminDomain(
  user: { role: Role; domainId: string },
  domainId: string
) {
  if (isSuperAdmin(user)) {
    return true;
  }
  if (user.role === Role.ADMIN && user.domainId === domainId) {
    return true;
  }
  return false;
}

export function canModifBookmark(
  currentUser: { role: Role; domainId: string; id: string },
  bookmarkUser: { id: string; domainId: string }
) {
  if (currentUser.id === bookmarkUser.id) {
    return true;
  }
  if (isAdminDomain(currentUser, bookmarkUser.domainId)) {
    return true;
  }
  return false;
}
