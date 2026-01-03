"use client";

import React from "react";

import { gochiHand } from "@/lib/fonts";
import { useBoard } from "./BoardProvider";

export type BoardTitleProps = Omit<
	React.HTMLAttributes<HTMLParagraphElement>,
	"children"
>;

export default function BoardTitle(props: BoardTitleProps) {
	const [boardState] = useBoard();

	const className = `${gochiHand.className} ${props.className}`;

	return (
		<p
			{...props}
			className={className}
		>
			{boardState?.title ?? ""}
		</p>
	);
}
