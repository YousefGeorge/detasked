"use client";

import React from "react";

import GenericMutableProvider, {
	GenericMutableProviderContextType,
	GenericMutableProviderProps,
} from "@/components/GenericMutableProvider";
import { boards } from "@/lib/db/schema/boards";

export type BoardProviderProps = Omit<
	GenericMutableProviderProps<(typeof boards.$inferSelect)[]>,
	"context"
>;

const context = React.createContext<
	GenericMutableProviderContextType<(typeof boards.$inferSelect)[]>
>([[], () => null]);

export default function BookmarksProvider(props: BoardProviderProps) {
	return (
		<GenericMutableProvider
			context={context}
			{...props}
		/>
	);
}

export const useBookmarks = () => React.useContext(context);
