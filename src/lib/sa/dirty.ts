import * as pg from "drizzle-orm";
import { PgTableWithColumns, PgUUID } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import db from "../db";
import { columns } from "../db/schema/columns";
import { notes } from "../db/schema/notes";
import { ServerActionResult } from "./types";

export type Dirty<Row, Type> = Row & {
	type: Type;
	change: "create" | "update" | "delete";
};
export type DirtyColumn = Dirty<typeof columns.$inferInsert, "column">;
export type DirtyNote = Dirty<typeof notes.$inferInsert, "note">;

export async function temper<
	Table extends PgTableWithColumns<
		pg.TableConfig<{ uuid: PgUUID<pg.ColumnBaseConfig<"string uuid">> }>
	>,
	Row extends { uuid: string },
	Type,
>(
	tx: typeof db | Parameters<Parameters<(typeof db)["transaction"]>["0"]>["0"],
	table: Table,
	insertSchema: ReturnType<typeof createInsertSchema>,
	updateSchema: ReturnType<typeof createUpdateSchema>,
	mod: Dirty<Row, Type>,
): Promise<ServerActionResult<string>> {
	if (mod.change == "delete") {
		await tx.delete(table).where(pg.eq(table.uuid, mod.uuid));
	} else if (mod.change == "create") {
		const { success, data, error } = insertSchema.safeParse(mod);

		if (success) {
			await tx.insert(table).values(data);
		} else {
			return {
				status: "error",
				error: error.message,
			};
		}
	} else if (mod.change == "update") {
		const { success, data, error } = updateSchema.safeParse(mod);

		if (success) {
			await tx.update(table).set(data).where(pg.eq(table.uuid, mod.uuid));
		} else {
			return {
				status: "error",
				error: error.message,
			};
		}
	}

	return { status: "success" };
}
