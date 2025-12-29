import { boards } from "../db/schema/boards";
import { columns } from "../db/schema/columns";
import { notes } from "../db/schema/notes";

export type ServerActionResult<E, C = undefined> =
	| (C extends undefined
			? { status: "success" }
			: { status: "success"; content: C })
	| { status: "error"; error: E };

export type ExtendedColumn = typeof columns.$inferSelect & {
	notes: (typeof notes.$inferSelect)[];
};
export type ExtendedBoard = typeof boards.$inferSelect & {
	columns: ExtendedColumn[];
};
