"use client";

import { ReactNode, useState } from "react";
import { MdNavigateNext } from "react-icons/md";

interface Props {
	label: string;
	children: ReactNode;
	className?: string;
}

export const CollapseContainer = (props: Props) => {
	const [open, setOpen] = useState(false);

	function handleOnToggle() {
		setOpen((prevState) => !prevState);
	}

	return (
		<details
			className={`${props.className} hover:cursor-pointer`}
			title={props.label}
			onToggle={handleOnToggle}
		>
			<summary
				className={`flex items-center justify-between select-none transition-all break-words ${open ? "text-blue-5F-500" : "hover:text-blue-5F-500"}`}>
				{props.label}
				<MdNavigateNext
					className={`size-4 transition-all ${open ? "rotate-90" : "rotate-0"}`}
				/>
			</summary>
			<ul className="w-full flex flex-col pl-2 pt-2">{props.children}</ul>
		</details>
	);
};
