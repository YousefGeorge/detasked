import { SaveFilled, UndoOutlined } from "@ant-design/icons";
import {
	Navbar,
	NavbarMenuToggle,
	NavbarProps as NextUINavbarProps,
} from "@nextui-org/react";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import { gochiHand } from "@/lib/fonts";
import BoardTitle from "../board/BoardTitle";
import SaveBoardModificationsButton from "../board/SaveBoardModificationsButton";
import UndoBoardModificationsButton from "../board/UndoBoardModificationsButton";
import DetaskedNavbarMenu from "./DetaskedNavbarMenu";

export type DetaskedNavbarProps = Omit<NextUINavbarProps, "children">;

export default async function DetaskedNavbar(props: DetaskedNavbarProps) {
	const className =
		`overflow-hidden bg-primary dark:bg-slate-800 text-white ` +
		`${props.className ?? ""}`;

	return (
		<Navbar
			maxWidth="full"
			{...props}
			className={className}
		>
			<div className="flex-1 grid grid-cols-[min-content_1fr_min-content] md:grid-cols-[1fr_2fr_1fr] items-center">
				<div className="flex justify-start items-center gap-3">
					<NavbarMenuToggle />
					<p
						className={`collapse overflow-hidden max-w-0 md:max-w-min md:visible text-2xl ${gochiHand.className}`}
					>
						Detasked
					</p>
				</div>
				<BoardTitle
					className={
						"min-w-0 md:text-center text-xl md:text-3xl" +
						"overflow-ellipsis overflow-hidden whitespace-nowrap"
					}
				/>
				<div className="flex justify-end">
					<UndoBoardModificationsButton
						variant="light"
						size="lg"
						isIconOnly
						className="text-inherit min-w-0 w-min"
						visibleClassName="mx-4"
						collapsedClassName="text-[0px] max-w-0 m-0 p-0"
					>
						<UndoOutlined />
					</UndoBoardModificationsButton>
					<SaveBoardModificationsButton
						variant="light"
						size="lg"
						isIconOnly
						className="text-inherit min-w-0 w-min"
						visibleClassName="me-4"
						collapsedClassName="text-[0px] max-w-0 m-0 p-0"
					>
						<SaveFilled />
					</SaveBoardModificationsButton>
					<ThemeSwitcher />
				</div>
			</div>
			<DetaskedNavbarMenu />
		</Navbar>
	);
}
