import * as pg from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod";

import { pgTable } from "../pg_table";

export enum UserSchemaError {
	INVALID_ID = "INVALID_ID",
}

export const users = pgTable("users", {
	uuid: pg.uuid().primaryKey(),
});

const zodRefinements = {
	uuid: () => z.uuid(UserSchemaError.INVALID_ID),
};
export const UserSelectSchema = createSelectSchema(users, zodRefinements);
export const UserInsertSchema = createInsertSchema(users, zodRefinements);
export const UserUpdateSchema = createUpdateSchema(users, zodRefinements);
