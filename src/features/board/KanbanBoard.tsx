"use client";

import React from "react";

import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
} from "@dnd-kit/core";

import { notes } from "@/lib/db/schema/notes";
import { DirtyColumn, DirtyNote } from "@/lib/sa/dirty";
import { genDefaultNote } from "@/lib/utils/default_board";
import { useBoard } from "./BoardProvider";
import { useDirtyBoardObjects } from "./DirtyBoardObjectsProvider";
import KanbanColumn from "./KanbanColumn";
import KanbanColumnTitle from "./KanbanColumnTitle";
import KanbanNote, { SortableData } from "./KanbanNote";

export type KanbanBoardProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"children"
>;

export default function KanbanBoard(props: KanbanBoardProps) {
	const [boardState, setBoardState] = useBoard();
	const [dragData, setDragData] = React.useState<SortableData>();
	const [, setDirtyObjects] = useDirtyBoardObjects();
	const [selectedColumn, setSelectedColumn] = React.useState(0);
	const updateDirtyObject = (key: string, value: DirtyColumn | DirtyNote) =>
		setDirtyObjects(dirtyObjects => {
			const notOnDataBase =
				key in dirtyObjects && dirtyObjects[key].change == "create";

			if (notOnDataBase && value.change == "delete") {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { [key]: toBeDeleted, ...rest } = dirtyObjects;

				return rest;
			}

			const change: typeof value.change = notOnDataBase
				? "create"
				: value.change;
			return {
				...dirtyObjects,
				[key]: { ...value, change },
			};
		});

	if (!boardState) {
		const className =
			`dark:bg-slate-900 flex flex-col justify-center items-center gap-2 ` +
			`${props.className ?? ""}`;

		return (
			<div className={className}>
				<p className="text-5xl">:/</p>
				<p className="text-2xl">Board deleted...</p>
			</div>
		);
	}

	const onNoteAdd = (colIdx: number, colId: string, pos: number) => {
		const newState = structuredClone(boardState);
		const newNote = genDefaultNote(colId);
		const dirtyNote: DirtyNote = { ...newNote, type: "note", change: "create" };

		newState.columns[colIdx].notes.splice(pos, 0, newNote);
		newState.modified = true;

		updateDirtyObject(newNote.uuid, dirtyNote);
		setBoardState(newState);
	};
	const onNoteDelete = (colId: number, pos: number) => {
		const newState = structuredClone(boardState);
		const note = newState.columns[colId].notes[pos];
		const dirtyNote: DirtyNote = {
			...note,
			type: "note",
			change: "delete",
		};

		newState.columns[colId].notes.splice(pos, 1);
		newState.modified = true;

		updateDirtyObject(note.uuid, dirtyNote);
		setBoardState(newState);
	};
	const onNoteEdit = (
		colId: number,
		position: number,
		note: typeof notes.$inferSelect,
	) => {
		const newState = structuredClone(boardState);
		const dirtyNote: DirtyNote = {
			...note,
			type: "note",
			change: "update",
		};

		newState.columns[colId].notes[position] = structuredClone(note);
		newState.modified = true;

		updateDirtyObject(note.uuid, dirtyNote);
		setBoardState(newState);
	};
	const onNoteDragStart = (e: DragStartEvent) =>
		setDragData(e.active.data.current as SortableData);
	const onNoteDragOver = (e: DragOverEvent) => {
		const { over } = e;

		if (over && over.id) {
			const idx = boardState.columns.findIndex(c => c.uuid == over.id);
			if (idx != -1) {
				setSelectedColumn(idx);
			}
		}
	};
	const onNoteDragEnd = (e: DragEndEvent) => {
		const { active, over } = e;

		if (over && active.id !== over.id) {
			const newState = structuredClone(boardState);

			const activeData = active.data.current as SortableData;
			const overData = over.data.current as SortableData | undefined;

			const oldColumnId = activeData.sortable.containerId;
			const newColumnId = overData ? overData.sortable.containerId : over.id;

			const oldColumnIndex = newState.columns.findIndex(
				c => c.uuid === oldColumnId,
			);
			const newColumnIndex = newState.columns.findIndex(
				c => c.uuid === newColumnId,
			);

			const oldColumn = newState.columns[oldColumnIndex];
			const newColumn = newState.columns[newColumnIndex];

			const overIndex = overData
				? overData.sortable.index
				: newColumn.notes.length;

			const newNote: typeof notes.$inferSelect = {
				...activeData.note,
				columnId: newColumn.uuid,
				order: overIndex,
			};
			const dirtyNote: DirtyNote = {
				...newNote,
				type: "note",
				change: "update",
			};

			oldColumn.notes.splice(activeData.sortable.index, 1);
			newColumn.notes.splice(overIndex, 0, newNote);
			newState.modified = true;

			const notesPushedDown = newColumn.notes.slice(overIndex + 1);
			if (notesPushedDown.length > 0 && notesPushedDown[0].order == overIndex) {
				for (const note of notesPushedDown) {
					updateDirtyObject(note.uuid, {
						...note,
						order: note.order + 1,
						type: "note",
						change: "update",
					});
				}
			}

			updateDirtyObject(activeData.note.uuid, dirtyNote);
			setBoardState(newState);
		}
		setDragData(undefined);
	};

	return (
		<DndContext
			onDragStart={onNoteDragStart}
			onDragOver={onNoteDragOver}
			onDragEnd={onNoteDragEnd}
		>
			<div className="flex flex-col flex-1">
				<div
					className={
						"flex " +
						"rounded-full overflow-hidden m-2 fixed left-0 right-0 " +
						"sm:rounded-none sm:m-0 sm:static " +
						"sm:gap-3 sm:p-4 sm:pb-0 sm:bg-inherit"
					}
				>
					{boardState.columns.map((column, idx) => (
						<KanbanColumnTitle
							key={column.uuid}
							column={column}
							className={
								"flex-1 p-4 sm:rounded-t-xl transition-opacity duration-700 " +
								"sm:opacity-100 " +
								"hover:opacity-100 " +
								(selectedColumn == idx ? "opacity-100" : "opacity-60")
							}
							onClick={() => setSelectedColumn(idx)}
						/>
					))}
				</div>
				<div
					{...props}
					className={
						`flex flex-1 overflow-hidden sm:gap-x-3 sm:p-4 sm:pt-0 ` +
						`${props.className ?? ""}`
					}
				>
					{boardState.columns.map((col, colIdx) => (
						<KanbanColumn
							key={col.uuid}
							column={col}
							className={
								"flex-1 sm:rounded-b-xl overflow-hidden " +
								"bg-slate-300 dark:bg-slate-700 " +
								(colIdx == selectedColumn
									? "pt-14 sm:pt-0"
									: "collapse max-w-0 sm:visible sm:max-w-none")
							}
							onNoteAdd={pos => onNoteAdd(colIdx, col.uuid, pos)}
							onNoteDelete={pos => onNoteDelete(colIdx, pos)}
							onNoteEdit={(pos, note) => onNoteEdit(colIdx, pos, note)}
						/>
					))}
					<DragOverlay>
						{dragData && <KanbanNote note={dragData.note} />}
					</DragOverlay>
				</div>
			</div>
		</DndContext>
	);
}
