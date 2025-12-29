import * as pg from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod";

import { pgTable } from "../pg_table";
import { columns } from "./columns";

export const NOTE_CONTENT_LEN = 128;
export enum NoteSchemaError {
	INVALID_ID = "INVALID_ID",
	INVALID_COLUMN_ID = "INVALID_COLUMN_ID",
	CONTENT_LONG = "CONTENT_LONG",
}

export const notes = pgTable(
	"notes",
	{
		uuid: pg.uuid().primaryKey(),
		columnId: pg
			.uuid()
			.notNull()
			.references(() => columns.uuid),
		content: pg.varchar({ length: NOTE_CONTENT_LEN }).default("").notNull(),
		order: pg.smallint().default(0).notNull(),
	},
	t => [pg.index("notes_column_id_idx").on(t.columnId)],
);

const zodRefinements = {
	uuid: () => z.uuid(NoteSchemaError.INVALID_ID),
	columnId: () => z.uuid(NoteSchemaError.INVALID_COLUMN_ID),
	content: () => z.string().max(NOTE_CONTENT_LEN, NoteSchemaError.CONTENT_LONG),
};
export const NoteSelectSchema = createSelectSchema(notes, zodRefinements);
export const NoteInsertSchema = createInsertSchema(notes, zodRefinements);
export const NoteUpdateSchema = createUpdateSchema(notes, zodRefinements);
