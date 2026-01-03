import BoardProvider from "@/features/board/BoardProvider";
import DirtyBoardObjectsProvider from "@/features/board/DirtyBoardObjectsProvider";
import KanbanBoard from "@/features/board/KanbanBoard";
import BookmarksProvider from "@/features/navbar/BookmarksProvider";
import DetaskedNavbar from "@/features/navbar/DetaskedNavbar";
import { getBoardSa } from "@/lib/sa/board";
import { getBookmarksSa } from "@/lib/sa/user";

export default async function BoardPage(props: {
	params: { boardId: string };
}) {
	const boardId = props.params.boardId;
	const boardResponse = await getBoardSa(props.params.boardId);
	const board =
		boardResponse.status == "success" ? boardResponse.content : undefined;
	const boardState = board
		? {
				boardId,
				modified: false,
				original: board,
				...board,
			}
		: null;

	const bookmarksRes = await getBookmarksSa();
	const bookmarks =
		bookmarksRes.status === "success" ? bookmarksRes.content : [];

	return (
		<BoardProvider initialValue={boardState}>
			<DirtyBoardObjectsProvider initialValue={{}}>
				<BookmarksProvider initialValue={bookmarks}>
					<div className="h-dvh flex flex-col bg-slate-100 dark:bg-slate-900">
						<DetaskedNavbar position="static" />
						<KanbanBoard className="min-h-0 flex-1" />
					</div>
				</BookmarksProvider>
			</DirtyBoardObjectsProvider>
		</BoardProvider>
	);
}
