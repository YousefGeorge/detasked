"use client";

import React from "react";

import GenericMutableProvider, {
	GenericMutableProviderContextType,
	GenericMutableProviderProps,
} from "@/components/GenericMutableProvider";
import { DirtyColumn, DirtyNote } from "@/lib/sa/dirty";

export type DirtyBoardObjectsState = Record<string, DirtyColumn | DirtyNote>;
export type DirtyBoardObjectsProviderProps = Omit<
	GenericMutableProviderProps<DirtyBoardObjectsState>,
	"context"
>;

const context = React.createContext<
	GenericMutableProviderContextType<DirtyBoardObjectsState>
>([{}, () => null]);

export default function DirtyBoardObjectsProvider(
	props: DirtyBoardObjectsProviderProps,
) {
	return (
		<GenericMutableProvider
			context={context}
			{...props}
		/>
	);
}

export const useDirtyBoardObjects = () => React.useContext(context);
