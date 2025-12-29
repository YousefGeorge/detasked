import { genDefaultBoard } from "@/lib/utils/default_board";
import db from "..";
import { boards } from "../schema/boards";
import { columns } from "../schema/columns";
import { notes } from "../schema/notes";
import { userBoards } from "../schema/user_boards";

export async function insertDefaultBoard(userId: string) {
	const data = genDefaultBoard();

	const bookmark: typeof userBoards.$inferInsert = {
		userId: userId,
		boardId: data.uuid,
	};
	const newBoard: typeof boards.$inferInsert = {
		uuid: data.uuid,
		title: data.title,
	};
	const newColumns: (typeof columns.$inferInsert)[] = data.columns.map(c => ({
		...c,
		boardId: newBoard.uuid,
	}));
	const newNotes: (typeof notes.$inferInsert)[] = data.columns.flatMap(c =>
		c.notes.map(n => ({ ...n, columnId: c.uuid })),
	);

	await db.transaction(async tx => {
		await tx.insert(boards).values(newBoard);
		await tx.insert(columns).values(newColumns);
		await tx.insert(notes).values(newNotes[0]);

		await tx.insert(userBoards).values(bookmark);
	});

	return data;
}
