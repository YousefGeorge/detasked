import * as pg from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod";

import { pgTable } from "../pg_table";
import { boards } from "./boards";

export const COLUMN_TITLE_LEN = 16;
export enum ColumnSchemaError {
	INVALID_ID = "INVALID_ID",
	INVALID_BOARD_ID = "INVALID_BOARD_ID",
	TITLE_LONG = "TITLE_LONG",
	INVALID_COLOR = "INVALID_COLOR",
}

export const columns = pgTable(
	"columns",
	{
		uuid: pg.uuid().primaryKey(),
		boardId: pg
			.uuid()
			.notNull()
			.references(() => boards.uuid),
		title: pg.varchar({ length: COLUMN_TITLE_LEN }).notNull(),
		headerColor: pg.integer().notNull(),
		order: pg.smallint().default(0).notNull(),
	},
	t => [pg.index("columns_board_id_idx").on(t.boardId)],
);

const zodRefinements = {
	uuid: () => z.uuid(ColumnSchemaError.INVALID_ID),
	boardId: () => z.uuid(ColumnSchemaError.INVALID_BOARD_ID),
	title: () => z.string().max(COLUMN_TITLE_LEN, ColumnSchemaError.TITLE_LONG),
	headerColor: () =>
		z
			.int()
			.min(0, ColumnSchemaError.INVALID_COLOR)
			.max(parseInt("FFFFFF", 16), ColumnSchemaError.INVALID_COLOR),
};
export const ColumnSelectSchema = createSelectSchema(columns, zodRefinements);
export const ColumnInsertSchema = createInsertSchema(columns, zodRefinements);
export const ColumnUpdateSchema = createUpdateSchema(columns, zodRefinements);
