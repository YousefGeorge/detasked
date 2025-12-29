import { defineRelations } from "drizzle-orm";

import { boards } from "./schema/boards";
import { columns } from "./schema/columns";
import { notes } from "./schema/notes";
import { userBoards } from "./schema/user_boards";
import { users } from "./schema/users";

export default defineRelations(
	{ users, userBoards, boards, columns, notes },
	r => ({
		users: {
			boards: r.many.boards({
				from: r.users.uuid.through(r.userBoards.userId),
				to: r.boards.uuid.through(r.userBoards.boardId),
			}),
		},
		boards: {
			users: r.many.users(),
			columns: r.many.columns(),
		},
		columns: {
			board: r.one.boards({
				from: r.columns.boardId,
				to: r.boards.uuid,
			}),
			notes: r.many.notes(),
		},
		notes: {
			column: r.one.columns({
				from: r.notes.columnId,
				to: r.columns.uuid,
			}),
		},
	}),
);
