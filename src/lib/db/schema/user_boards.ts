import * as pg from "drizzle-orm/pg-core";

import { pgTable } from "../pg_table";
import { boards } from "./boards";
import { users } from "./users";

export const userBoards = pgTable(
	"user_boards",
	{
		userId: pg
			.uuid()
			.primaryKey()
			.references(() => users.uuid),
		boardId: pg
			.uuid()
			.primaryKey()
			.references(() => boards.uuid),
	},
	t => [
		pg.primaryKey({ columns: [t.userId, t.boardId] }),
		pg.index("user_boards_user_id_idx").on(t.userId),
		pg.index("user_boards_board_id_idx").on(t.boardId),
		pg.index("user_boards_composite_idx").on(t.userId, t.boardId),
	],
);
