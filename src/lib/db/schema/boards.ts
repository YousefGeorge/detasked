import * as pg from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod";

import { pgTable } from "../pg_table";

export const BOARD_TITLE_LEN = 32;
export enum BoardSchemaError {
	INVALID_ID = "INVALID_ID",
	TITLE_LONG = "TITLE_LONG",
	NOT_FOUND = "NOT_FOUND",
}

export const boards = pgTable("boards", {
	uuid: pg.uuid().primaryKey(),
	title: pg.varchar({ length: BOARD_TITLE_LEN }).notNull(),
});

const zodRefinements = {
	uuid: () => z.uuid(BoardSchemaError.INVALID_ID),
	title: (schema: z.ZodString) =>
		schema.max(BOARD_TITLE_LEN, BoardSchemaError.TITLE_LONG),
};
export const BoardSelectSchema = createSelectSchema(boards, zodRefinements);
export const BoardInsertSchema = createInsertSchema(boards, zodRefinements);
export const BoardUpdateSchema = createUpdateSchema(boards, zodRefinements);
