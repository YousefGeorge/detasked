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
				className="flex-1 min-w-0 bg-transparent whitespace-nowrap text-2xl text-ellipsis text-foreground overflow-collapse"
				onCommit={onTitleUpdate}
			/>
			<AsyncButton
				variant="light"
				eventName="onClick"
				onHandle={onDelete}
				isIconOnly
				className="h-full rounded-none data-[hover=true]:bg-red-700 data-[hover=true]:text-white"
			>
				<DeleteFilled />
			</AsyncButton>
			<Button
				variant="light"
				onClick={onNavigate}
				isIconOnly
				className="h-full rounded-none"
			>
				<RightOutlined />
			</Button>
		</div>
	);
}
