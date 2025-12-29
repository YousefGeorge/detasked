import React from "react";

import { NavbarMenu, NavbarMenuProps } from "@nextui-org/react";

import DetaskedBookmarkList from "./DetaskedBookmarkList";
import NewBookmarkButton from "./NewBookmarkButton";

export type DetaskedNavbarMenuProps = Omit<NavbarMenuProps, "children">;

export default function DetaskedNavbarMenu(props: DetaskedNavbarMenuProps) {
	const { className: classNameOverrides, ...otherProps } = props;

	const className = "flex flex-col w-1/4 p-0" + ` ${classNameOverrides ?? ""}`;

	return (
		<NavbarMenu
			className={className}
			{...otherProps}
		>
			<DetaskedBookmarkList className="flex-1 overflow-y-auto min-h-0" />
			<NewBookmarkButton />
		</NavbarMenu>
	);
}
