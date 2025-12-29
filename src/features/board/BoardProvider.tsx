"use client";

import React from "react";

import GenericMutableProvider, {
	GenericMutableProviderContextType,
	GenericMutableProviderProps,
} from "@/components/GenericMutableProvider";
import { ExtendedBoard } from "@/lib/sa/types";

export type BoardState =
	| (ExtendedBoard & {
			modified: boolean;
			original: ExtendedBoard;
	  })
	| null;
export type BoardProviderProps = Omit<
	GenericMutableProviderProps<BoardState>,
	"context"
>;

const context = React.createContext<
	GenericMutableProviderContextType<BoardState>
>([null, () => null]);

export default function BoardProvider(props: BoardProviderProps) {
	return (
		<GenericMutableProvider
			context={context}
			{...props}
		/>
	);
}

export const useBoard = () => React.useContext(context);
