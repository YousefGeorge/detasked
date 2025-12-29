import "server-only";

import {
	RequestCookies,
	ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { type NextRequest, type NextResponse } from "next/server";

import db from "../db";
import { users } from "../db/schema/users";

export const SESSION_COOKIE_KEY = "_SESSION";

export function getSessionId(jars?: (RequestCookies | ResponseCookies)[]) {
	const jarsSession = jars
		?.map(j => j.get(SESSION_COOKIE_KEY)?.value)
		.reduce((a, b) => a ?? b);
	const requestSession = cookies().get(SESSION_COOKIE_KEY)?.value;

	return jarsSession ?? requestSession;
}

export default async function sessionMiddleware(
	request: NextRequest,
	response: NextResponse,
): Promise<NextResponse> {
	const userId = request.cookies.get(SESSION_COOKIE_KEY)?.value;
	const sessionValid =
		userId && (await db.query.users.findFirst({ where: { uuid: userId } }));

	if (!sessionValid) {
		const user: typeof users.$inferInsert = { uuid: crypto.randomUUID() };
		await db.insert(users).values(user);

		response.cookies.set(SESSION_COOKIE_KEY, user.uuid, {
			secure: true,
			sameSite: true,
		});
	}

	return response;
}
