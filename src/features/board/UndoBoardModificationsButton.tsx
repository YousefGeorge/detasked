"use client";

import React from "react";

import { ButtonProps } from "@nextui-org/react";

import AsyncButton from "@/components/AsyncButton";
import { useBoard } from "./BoardProvider";

export type UndoBoardModificationsButton = Omit<ButtonProps, "onClick"> & {
	visibleClassName?: string;
	collapsedClassName?: string;
};

export default function UndoBoardModificationsButton(
	props: UndoBoardModificationsButton,
) {
	const {
		className: classNameOverrides,
		visibleClassName,
		collapsedClassName,
		...otherProps
	} = props;
	const [boardState, setBoardState] = useBoard();

	const visible = boardState && boardState.modified;
	const visibility = visible
		? `visible ${visibleClassName ?? ""}`
		: `collapse ${collapsedClassName ?? ""}`;
	const className = `${visibility} ${classNameOverrides ?? ""}`;

	const undo = async () => {
		if (!boardState) return;

		setBoardState({
			...boardState,
			...structuredClone(boardState.original),
			modified: false,
		});
	};

	return (
		<AsyncButton
			className={className}
			disabled={!visible}
			onHandle={undo}
			eventName="onClick"
			{...otherProps}
		/>
	);
}
