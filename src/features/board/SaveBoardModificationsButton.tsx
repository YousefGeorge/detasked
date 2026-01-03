"use client";

import React from "react";

import { Button, ButtonProps, Spinner } from "@nextui-org/react";
import { toast } from "react-toastify";

import { applyModificationsSa } from "@/lib/sa/board";
import { useBoard } from "./BoardProvider";
import { useDirtyBoardObjects } from "./DirtyBoardObjectsProvider";

export type SaveBoardModificationsButton = Omit<ButtonProps, "onClick"> & {
	visibleClassName?: string;
	collapsedClassName?: string;
};

export default function SaveBoardModificationsButton(
	props: SaveBoardModificationsButton,
) {
	const {
		className: classNameOverrides,
		visibleClassName,
		collapsedClassName,
		children,
		...otherProps
	} = props;
	const [boardState, setBoardState] = useBoard();
	const [dirtyObjects] = useDirtyBoardObjects();
	const [isSaving, setSaving] = React.useState(false);

	const visible = boardState && boardState.modified;
	const visibility = visible
		? `visible ${visibleClassName ?? ""}`
		: `collapse ${collapsedClassName ?? ""}`;
	const className = `${visibility} ${classNameOverrides ?? ""}`;

	const save = async () => {
		if (!boardState) return;

		setSaving(true);
		let res;
		try {
			res = await applyModificationsSa(Object.values(dirtyObjects));
		} catch {
			toast("Network error :/");
			setSaving(false);
			return;
		}

		if (res && res.status == "success") {
			setBoardState({
				...boardState,
				modified: false,
				original: {
					uuid: boardState.uuid,
					title: boardState.title,
					columns: structuredClone(boardState.columns),
				},
			});
		} else {
			toast("Saving failed :/");
		}

		setSaving(false);
	};

	return (
		<Button
			className={className}
			disabled={!visible || isSaving}
			onClick={save}
			{...otherProps}
		>
			{isSaving ? <Spinner /> : children}
		</Button>
	);
}
