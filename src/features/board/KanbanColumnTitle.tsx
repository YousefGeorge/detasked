import React, { HTMLAttributes } from "react";

import { columns } from "@/lib/db/schema/columns";
import { gochiHand } from "@/lib/fonts";

export type KanbanColumnTitleProps = HTMLAttributes<HTMLDivElement> & {
	column: typeof columns.$inferSelect;
};

export default function KanbanColumnTitle(props: KanbanColumnTitleProps) {
	const { column, ...divProps } = props;

	const className =
		`text-black text-5xl text-center content-center rounded-t-2xl ` +
		`${gochiHand.className} ${divProps.className ?? ""}`;
	const backgroundColor = React.useMemo(
		() => `#${column.headerColor.toString(16)}`,
		[column.headerColor],
	);

	return (
		<div
			{...divProps}
			style={{ backgroundColor, ...divProps.style }}
			className={className}
		>
			{column.title.toUpperCase()}
		</div>
	);
}
