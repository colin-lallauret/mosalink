"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  routeCategorieFront,
  routeTagFront,
  routeUserFront,
} from "@/utils/routes/routesFront";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { BookmarkData } from "@/hooks/bookmark/useQueryBookmarksUser";
import DropdownBookmarkCard from "./DropdownBookmarkCard";
import { defaultImageBookmark } from "../../../../../constants";
import { useState } from "react";

interface Props {
  bookmark: BookmarkData;
  folderId?: string;
  isPublic?: boolean;
}

const BookmarkCard = ({ bookmark, folderId, isPublic }: Props) => {
  const router = useRouter();
  const session = useSession();

  const [imageError, setImageError] = useState(false);

  return (
    <Link href={bookmark.url} target="_blank">
      <div className="group inline-flex flex-col p-4 gap-4 border rounded shadow w-[300px] max-h-[500px]">
        <Image
          onErrorCapture={() => setImageError(true)}
          src={imageError ? defaultImageBookmark : bookmark.image ?? ""}
          alt={bookmark.title}
          width={250}
          height={150}
          unoptimized
          className="w-full h-[150px] rounded object-cover"
        />
        <div className="flex justify-between items-center gap-2">
          <p
            className="font-bold text-lg
           truncate w-[250px]
           group-hover:underline"
          >
            {bookmark.title}
          </p>
          {!isPublic && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <DropdownBookmarkCard bookmark={bookmark} folderId={folderId} />
            </div>
          )}
        </div>
        <p className="h-20 text-sm text-nowrap overflow-hidden text-ellipsis">
          {bookmark.description}
        </p>
        <div>
          <Badge
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(
                routeCategorieFront(
                  session.data?.user.domainName,
                  bookmark.category.url
                )
              );
            }}
          >
            {bookmark.category.name}
          </Badge>
        </div>

        <div className="flex gap-2 flex-wrap">
          {bookmark.tags?.map((tag) => (
            <Badge
              className="cursor-pointer"
              variant={"outline"}
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(routeTagFront(session.data?.user.domainName, tag));
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <p
          className="text-right text-xs text-slate-500 w-fit cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            router.push(
              routeUserFront(session.data?.user.domainName, bookmark.user.id)
            );
          }}
        >
          {bookmark.user.email}
        </p>
      </div>
    </Link>
  );
};

export default BookmarkCard;
