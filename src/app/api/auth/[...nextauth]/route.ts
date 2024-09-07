import { MONGODB_LINE_USER_URI } from "@/app/api/mongo/constants";
import { MongoClient } from "mongodb";
import NextAuth, { User } from "next-auth";
import LineProvider from "next-auth/providers/line";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		LineProvider({
			clientId: process.env.LINE_CLIENT_ID ?? "",
			clientSecret: process.env.LINE_CLIENT_SECRET ?? "",
			authorization: {params: {scope: "profile openid email"}},
			checks: ["state"],
		}),
		CredentialsProvider({
			credentials: {
				email: {label: "Email", type: "email"},
				name: {label: "Name", type: "text"},
			},
			async authorize(credentials) {
				console.log("credentials: ", credentials);
				if (!credentials) return null;
				const {email, name} = credentials;
				const newUser = {
					name,
					email,
					image: "",
				};
				try {
					const MONGODB_LINE_USER_CLIENT = new MongoClient(MONGODB_LINE_USER_URI);
					await MONGODB_LINE_USER_CLIENT.connect();
					const db = MONGODB_LINE_USER_CLIENT.db("LineUser");
					const collections = db.collection("BasicInfo");
					const res = await collections.find({email}).toArray();
					console.log(res);
					if (res.length === 1) {
						const user = JSON.parse(JSON.stringify(res[0])) as User;
						console.log("user: ", user);
						await MONGODB_LINE_USER_CLIENT.close();
						return user;
					} else {
						const res = await collections.insertOne(newUser);
						console.log(res);
						console.log("new user: ", newUser);
						await MONGODB_LINE_USER_CLIENT.close();
						return newUser as User;
					}
				} catch (e) {
					console.error("authorize failed: ", e);
					return newUser as User;
				}
			},
		}),
	],
});

export { handler as GET, handler as POST };
