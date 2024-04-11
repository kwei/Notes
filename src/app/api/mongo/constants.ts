import { MongoClient } from "mongodb";

export const MONGODB_LINE_USER_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@lineuser.xn8zlvq.mongodb.net/?retryWrites=true&w=majority&appName=LineUser`;
export const MONGODB_LINE_USER_CLIENT = new MongoClient(MONGODB_LINE_USER_URI);
