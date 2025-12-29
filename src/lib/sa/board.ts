"use server";

import * as pg from "drizzle-orm";

import db from "../db";
import {
	boards,
	BoardSchemaError,
	BoardUpdateSchema,
} from "../db/schema/boards";
import {
	ColumnInsertSchema,
	columns,
	ColumnSchemaError,
	ColumnUpdateSchema,
} from "../db/schema/columns";
import {
	NoteInsertSchema,
	notes,
	NoteSchemaError,
	NoteUpdateSchema,
} from "../db/schema/notes";
import { DirtyColumn, DirtyNote, temper } from "./dirty";
import { ExtendedBoard, ServerActionResult } from "./types";

export async function getBoardSa(
	boardId: string,
): Promise<ServerActionResult<BoardSchemaError, ExtendedBoard>> {
	const board = await db.query.boards.findFirst({
		with: {
			columns: {
				with: {
					notes: {
						orderBy: {
							order: "asc",
						},
					},
				},
				orderBy: {
					order: "asc",
				},
			},
		},
		where: {
			uuid: boardId,
		},
	});

	if (!board) {
		return { status: "error", error: BoardSchemaError.NOT_FOUND };
	}

	return {
		status: "success",
		content: board,
	};
}

export async function updateBoardTitleSa(
	boardId: string,
	newTitle: string,
): Promise<ServerActionResult<BoardSchemaError>> {
	const parsedData = BoardUpdateSchema.safeParse({
		title: newTitle,
	});

	if (!parsedData.success) {
		return {
			status: "error",
			error: parsedData.error.message as unknown as BoardSchemaError,
		};
	}
	await db
		.update(boards)
		.set(parsedData.data)
		.where(pg.eq(boards.uuid, boardId));

	return { status: "success" };
}

export async function applyModificationsSa(
	modifications: (DirtyColumn | DirtyNote)[],
): Promise<ServerActionResult<ColumnSchemaError | NoteSchemaError | unknown>> {
	try {
		await db.transaction(async tx => {
			for (const mod of modifications) {
				if (mod.type == "column") {
					await applyColumnModificationSa(tx, mod);
				} else if (mod.type == "note") {
					await applyNoteModification(tx, mod);
				}
			}
		});
	} catch (error) {
		return { status: "error", error };
	}

	return { status: "success" };
}

async function applyColumnModificationSa(
	tx: Parameters<Parameters<(typeof db)["transaction"]>["0"]>["0"],
	mod: DirtyColumn,
) {
	const result = await temper(
		tx,
		columns,
		ColumnInsertSchema,
		ColumnUpdateSchema,
		mod,
	);

	if (result.status == "error") {
		throw new Error(result.error as ColumnSchemaError);
	}
}

async function applyNoteModification(
	tx: Parameters<Parameters<(typeof db)["transaction"]>["0"]>["0"],
	mod: DirtyNote,
) {
	const result = await temper(
		tx,
		notes,
		NoteInsertSchema,
		NoteUpdateSchema,
		mod,
	);

	if (result.status == "error") {
		throw new Error(result.error as NoteSchemaError);
	}
}
