import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import ThemedToastContainer from "@/components/ThemedToastContainer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Detasked",
	description: "A quick and simple Kanban App",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
			</head>
			<body className={inter.className}>
				<Providers>
					{children}
					<ThemedToastContainer position="bottom-right" />
				</Providers>
			</body>
		</html>
	);
}
