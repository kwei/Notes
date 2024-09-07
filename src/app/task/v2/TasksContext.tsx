"use client";

import { IMongoQueryRes, ITodo, IUser } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { useUserStoreCtx } from "@/utils/externalStores";
import { getTodoList } from "@/utils/getTodoList";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext, useEffect,
	useMemo,
	useState,
} from "react";

export const TasksContext = ({
															 children,
														 }: {
	children: ReactNode;
}) => {
	const {useStore: useUserStore} = useUserStoreCtx();
	const [user] = useUserStore((state) => state);
	const [loading, setLoading] = useState(true);
	const [tasks, setTasks] = useState<ITodo[]>([]);

	const parse2TaskTable = (tasks: ITodo[]) => {
		const _taskTable: Record<TASK_STATUS, ITodo[]> = {
			[TASK_STATUS.BACKLOG]: [],
			[TASK_STATUS.NEW_REQUEST]: [],
			[TASK_STATUS.IN_PROGRESS]: [],
			[TASK_STATUS.COMPLETE]: [],
		};
		tasks.forEach((task) => {
			_taskTable[task.status.name].push(task);
		});
		return _taskTable;
	};

	const getUser = useCallback(() => {
		return user;
	}, [user]);

	const reFetch = useCallback(async () => {
		return getTodoList({userEmail: user.email})
			.then((res: IMongoQueryRes) => {
				if (res.status) return JSON.parse(res.message) as ITodo[];
				return [];
			})
			.then(setTasks);
	}, [user.email]);

	const ctxVal = useMemo(
		() => ({
			tasks: parse2TaskTable(
				sortTask(tasks.filter((task) => task.userEmail === user.email)),
			),
			reFetch,
			getUser,
			loading
		}),
		[tasks, user.email, reFetch, getUser, loading],
	);

	useEffect(() => {
		if (user && user.email !== "") {
			getTasks(user.email).then(setTasks).then(() => {
				setLoading(false);
			});
		}
	}, [user]);

	return <Ctx.Provider value={ctxVal}>{children}</Ctx.Provider>;
};

const Ctx = createContext<{
	tasks: Record<TASK_STATUS, ITodo[]>;
	reFetch: () => Promise<void>;
	getUser: () => IUser;
	loading: boolean
}>({
	tasks: {
		[TASK_STATUS.BACKLOG]: [],
		[TASK_STATUS.NEW_REQUEST]: [],
		[TASK_STATUS.COMPLETE]: [],
		[TASK_STATUS.IN_PROGRESS]: [],
	},
	reFetch: async () => {
	},
	getUser: () => ({
		name: "",
		email: "",
		image: "",
	}),
	loading: true,
});

export const useTaskContext = () => useContext(Ctx);

function sortTask(list: ITodo[]) {
	return list.sort((a, b) => {
		if (!a.expiry && b.expiry) {
			return 1;
		} else if (a.expiry && !b.expiry) {
			return -1;
		} else if (a.expiry && b.expiry) {
			return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
		}
		return 0;
	});
}

const getTasks = async (userEmail: string) => {
	return getTodoList({userEmail}).then((res: IMongoQueryRes) => {
		if (res.status) return JSON.parse(res.message) as ITodo[];
		return [];
	});
};