"use client";

import { DeleteFilled, RightOutlined } from "@ant-design/icons";
import { Button } from "@nextui-org/react";

import AsyncButton from "@/components/AsyncButton";
import TogglableInput from "@/components/TogglableInput";
import { boards } from "@/lib/db/schema/boards";
import { gochiHand } from "@/lib/fonts";

export type DetaskedNavbarMenuItemProps = Omit<
	React.HtmlHTMLAttributes<HTMLDivElement>,
	"children"
> & {
	boardItem: typeof boards.$inferSelect;
	onNavigate?: () => void;
	onTitleUpdate?: (newTitle: string) => void;
	onDelete?: () => Promise<void>;
};

export default function DetaskedBookmarkItem(
	props: DetaskedNavbarMenuItemProps,
) {
	const {
		boardItem,
		onNavigate,
		onTitleUpdate,
		onDelete,
		className: classNameOverrides,
		...otherProps
	} = props;

	const className =
		"flex items-center" + ` ${gochiHand.className} ${classNameOverrides}`;

	return (
		<div
			className={className}
			{...otherProps}
		>
			<TogglableInput
				value={boardItem.title}
				className="flex-auto bg-transparent whitespace-nowrap text-2xl text-ellipsis text-foreground overflow-hidden pe-8"
				onCommit={onTitleUpdate}
			/>
			<AsyncButton
				variant="light"
				eventName="onClick"
				onHandle={onDelete}
				isIconOnly
			>
				<DeleteFilled />
			</AsyncButton>
			<Button
				variant="light"
				onClick={onNavigate}
				isIconOnly
			>
				<RightOutlined />
			</Button>
		</div>
	);
}
