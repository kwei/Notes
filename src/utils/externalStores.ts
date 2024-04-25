"use client";

import { IUser } from "@/type";
import { createExternalStoreProvider } from "@/utils/createExternalStoreProvider";

export const { Provider: UserProvider, useStoreCtx: useUserStoreCtx } = createExternalStoreProvider<IUser>({
	name: '',
	email: '',
	image: ''
});
