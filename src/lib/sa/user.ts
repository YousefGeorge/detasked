"use server";

import * as pg from "drizzle-orm";

import db from "../db";
import { boards } from "../db/schema/boards";
import { userBoards } from "../db/schema/user_boards";
import { UserSchemaError } from "../db/schema/users";
import { insertDefaultBoard } from "../db/utils/default_board";
import { getSessionId } from "../middleware/session_middleware";
import { ServerActionResult } from "./types";

export async function createBookmarkSa(): Promise<
	ServerActionResult<UserSchemaError.INVALID_ID, typeof boards.$inferInsert>
> {
	const userId = getSessionId();

	if (!userId) {
		return { status: "error", error: UserSchemaError.INVALID_ID };
	}

	const newBoard = await insertDefaultBoard(userId);
	const boardItem = { uuid: newBoard.uuid, title: newBoard.title };

	return { status: "success", content: boardItem };
}

export async function deleteBookmarkSa(boardId: string) {
	const userId = getSessionId();

	if (!userId) {
		return { status: "error", error: UserSchemaError.INVALID_ID };
	}

	await db
		.delete(userBoards)
		.where(
			pg.and(
				pg.eq(userBoards.userId, userId),
				pg.eq(userBoards.boardId, boardId),
			),
		);

	const { count: remainingBoardUsersCount } = (
		await db
			.select({ count: pg.count() })
			.from(userBoards)
			.where(pg.eq(userBoards.boardId, boardId))
	)[0];
	if (remainingBoardUsersCount == 0) {
		db.delete(boards).where(pg.eq(boards.uuid, boardId));
	}
}

export async function getBookmarksSa(): Promise<
	ServerActionResult<UserSchemaError.INVALID_ID, (typeof boards.$inferSelect)[]>
> {
	const userId = getSessionId() ?? "";

	if (!userId) {
		return { status: "error", error: UserSchemaError.INVALID_ID };
	}

	const bookmarks = await db.query.boards.findMany({
		where: {
			users: {
				uuid: userId,
			},
		},
	});

	return { status: "success", content: bookmarks };
}
