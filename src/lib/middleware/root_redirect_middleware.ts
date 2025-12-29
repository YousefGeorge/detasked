import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import db from "../db";
import { insertDefaultBoard } from "../db/utils/default_board";
import { buildBoardPageUrl } from "../paths";
import { getSessionId } from "./session_middleware";

// Runs when no board was specified to access
export default async function rootRedirectMiddleware(
	request: NextRequest,
	response: NextResponse,
): Promise<NextResponse> {
	if (request.nextUrl.pathname != "/") {
		return response;
	}

	const userId = getSessionId([response.cookies, request.cookies]);

	if (!userId) {
		// Session middleware should always run before this one
		throw "Unexpected state: session is null";
	}

	const bookmark = await db.query.boards.findFirst({
		where: {
			users: {
				uuid: userId,
			},
		},
	});

	// If no bookmarks, create a new board,
	// otherwise, select the first board from the bookmarks set
	let bookmarkId = bookmark?.uuid;
	if (!bookmarkId) {
		bookmarkId = (await insertDefaultBoard(userId)).uuid;
	}

	const url = buildBoardPageUrl(bookmarkId);

	const newResponse = NextResponse.redirect(new URL(url, request.url), {
		...response,
		status: 303,
	});

	response.cookies.getAll().forEach(cookie => {
		newResponse.cookies.set(cookie);
	});

	return newResponse;
}
