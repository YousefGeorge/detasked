"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import AsyncButton, { AsyncButtonProps } from "@/components/AsyncButton";
import { UserSchemaError } from "@/lib/db/schema/users";
import { buildBoardPageUrl } from "@/lib/paths";
import { createBookmarkSa } from "@/lib/sa/user";
import { useBoard } from "../board/BoardProvider";
import { useBookmarks } from "./BookmarksProvider";

type NewBookmarkButtonProps = Omit<AsyncButtonProps, "eventName">;

export default function NewBookmarkButton(props: NewBookmarkButtonProps) {
	const [, setBookmarks] = useBookmarks();
	const [boardState] = useBoard();

	const router = useRouter();

	const onCreate = async () => {
		let bookmarkRes;
		try {
			bookmarkRes = await createBookmarkSa();
		} catch {
			toast("Network error :/");
			return;
		}

		if (bookmarkRes.status === "error") {
			if (bookmarkRes.error === UserSchemaError.INVALID_ID) {
				toast("Where da cookie?");
			} else {
				toast("What just happened :?");
			}

			return;
		}

		const boardItem = bookmarkRes.content;

		setBookmarks(bs => [...bs, boardItem]);

		if (!boardState) {
			router.push(buildBoardPageUrl(boardItem.uuid));
		}
	};

	return (
		<AsyncButton
			className="rounded-none text-white"
			color="primary"
			onHandle={onCreate}
			eventName="onClick"
			{...props}
		>
			<PlusOutlined />
		</AsyncButton>
	);
}
