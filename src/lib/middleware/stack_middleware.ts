import "server-only";

import { NextRequest, NextResponse } from "next/server";

export type StackableMiddleware = (
	// eslint-disable-next-line no-unused-vars
	request: NextRequest,
	// eslint-disable-next-line no-unused-vars
	response: NextResponse,
) => Promise<NextResponse>;

export default async function stackMiddleware(
	request: NextRequest,
	middlewares: StackableMiddleware[],
) {
	let response = NextResponse.next();

	for (const middleware of middlewares) {
		response = await middleware(request, response);
	}

	return response;
}
