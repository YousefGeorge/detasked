"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { buildBoardPageUrl } from "@/lib/paths";
import { updateBoardTitleSa } from "@/lib/sa/board";
import { deleteBookmarkSa } from "@/lib/sa/user";
import { useBoard } from "../board/BoardProvider";
import { useBookmarks } from "./BookmarksProvider";
import DetaskedBookmarkItem from "./DetaskedBookmarkItem";

export type DetaskedBookmarkListProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"children"
>;

export default function DetaskedBookmarkList(props: DetaskedBookmarkListProps) {
	const [bookmarks, setBookmarks] = useBookmarks();
	const [boardState, setBoardState] = useBoard();
	const router = useRouter();

	const className =
		"divide-y divide-solid divide-foreground/20" + ` ${props.className}`;

	const onNavigate = (i: number) => () =>
		router.push(buildBoardPageUrl(bookmarks[i].uuid));
	const onTitleUpdate = (i: number) => async (title: string) => {
		try {
			const res = await updateBoardTitleSa(bookmarks[i].uuid, title);

			if (res.status == "error") {
				toast("Failed :/");
				return;
			}
		} catch {
			toast("Network Error :/");
			return;
		}

		// If editing the title of the open board
		if (bookmarks[i].uuid === boardState?.uuid) {
			setBoardState({
				...boardState,
				title,
			});
		}

		setBookmarks(bs => {
			bs[i] = { ...bs[i], title };

			return bs;
		});
	};
	const onDelete = (i: number) => async () => {
		const boardId = bookmarks[i].uuid;

		await deleteBookmarkSa(boardId);
		setBookmarks(bs => {
			bs.splice(i, 1);

			if (boardId === boardState?.uuid) {
				if (bs.length === 0) {
					setBoardState(null);
				} else {
					router.push(buildBoardPageUrl(bs[0].uuid));
				}
			}

			return bs;
		});
	};

	if (bookmarks.length === 0) {
		return (
			<div
				{...props}
				className={
					"flex flex-col justify-center items-center divide-y-0 " + className
				}
			>
				<span>:/</span>
				<span>No bookmarks</span>
			</div>
		);
	}

	return (
		<div
			{...props}
			className={className}
		>
			{bookmarks.map((b, i) => (
				<DetaskedBookmarkItem
					key={b.uuid}
					boardItem={b}
					className={
						"h-20 ps-4 " +
						(b.uuid === boardState?.uuid
							? "bg-primary text-white"
							: "dark:text-white")
					}
					onNavigate={onNavigate(i)}
					onTitleUpdate={onTitleUpdate(i)}
					onDelete={onDelete(i)}
				/>
			))}
		</div>
	);
}
