import React, { HTMLAttributes } from "react";

import { useDroppable } from "@dnd-kit/core";

import { columns } from "@/lib/db/schema/columns";
import { gochiHand } from "@/lib/fonts";

export type KanbanColumnTitleProps = HTMLAttributes<HTMLDivElement> & {
	column: typeof columns.$inferSelect;
};

export default function KanbanColumnTitle(props: KanbanColumnTitleProps) {
	const { column, ...divProps } = props;
	const { setNodeRef } = useDroppable({
		id: column.uuid,
	});

	const className =
		`text-black text-base font-bold text-center content-center ` +
		`overflow-hidden text-ellipsis text-nowrap  ` +
		`${gochiHand.className} ${divProps.className ?? ""}`;
	const backgroundColor = React.useMemo(
		() => `#${column.headerColor.toString(16)}`,
		[column.headerColor],
	);

	return (
		<h2
			{...divProps}
			ref={setNodeRef}
			style={{ backgroundColor, ...divProps.style }}
			className={className}
		>
			{column.title.toUpperCase()}
		</h2>
	);
}
