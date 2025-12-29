"use client";

import React from "react";

import {
	DeleteFilled,
	PicCenterOutlined,
	SwapOutlined,
} from "@ant-design/icons";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { SortableData as DnDSortableData } from "@dnd-kit/sortable";
import { Button } from "@nextui-org/react";

import TogglableTextarea from "@/components/TogglableTextarea";
import { notes } from "@/lib/db/schema/notes";
import { gochiHand } from "@/lib/fonts";

export type KanbanNoteProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"children"
> & {
	note: typeof notes.$inferSelect;
	onNoteDelete?: () => void;
	onNoteEdit?: (note: typeof notes.$inferSelect) => void;
	displayRepresentation?: boolean;
	moveNoteListeners?: SyntheticListenerMap;
};

export type SortableData = DnDSortableData & {
	note: typeof notes.$inferSelect;
};

const KanbanNote = React.forwardRef<HTMLDivElement, KanbanNoteProps>(
	(props, ref) => {
		const {
			note,
			displayRepresentation,
			onNoteEdit,
			onNoteDelete,
			moveNoteListeners,
			...divProps
		} = props;

		const [editable, setEditable] = React.useState(false);

		const className: KanbanNoteProps["className"] =
			`relative rounded-xl text-center content-center group p-2` +
			` ${displayRepresentation ? "outline outline-primary outline-dashed" : "bg-slate-100 dark:bg-slate-600"}` +
			` ${editable ? "outline outline-primary" : ""}` +
			` ${gochiHand.className} ${divProps.className ?? ""}`;

		const onContentModified = (content: string) => {
			const contentChanged = content !== note.content;

			return contentChanged && onNoteEdit?.({ ...note, content });
		};

		return (
			<div
				{...divProps}
				className={className}
				ref={ref}
			>
				{displayRepresentation && <SwapOutlined />}
				{!displayRepresentation && (
					<>
						<TogglableTextarea
							value={note.content}
							className="min-h-0 h-fit w-full bg-transparent resize-none outline-none text-center align-middle "
							rows={4}
							onCommit={onContentModified}
							onToggle={setEditable}
						/>
						<Button
							variant="light"
							className="absolute bottom-0 end-0 text-foreground/0 group-hover:text-foreground/100 m-1"
							onClick={onNoteDelete}
							isIconOnly
						>
							<DeleteFilled />
						</Button>
						<div
							className={
								"absolute bottom-0 start-0 inline-flex items-center justify-center " +
								"box-border subpixel-antialiased rounded-medium px-0 m-1 " +
								"bg-transparent hover:bg-default/40 min-w-10 w-10 h-10 " +
								"text-foreground/0 group-hover:text-foreground/100 "
							}
							{...moveNoteListeners}
						>
							<PicCenterOutlined />
						</div>
					</>
				)}
			</div>
		);
	},
);
KanbanNote.displayName = "KanbanNote";

export default KanbanNote;
