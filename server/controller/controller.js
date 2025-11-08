import { v4 as uuid } from "uuid";
import pool from "../database/database.js";

const postUser = async (request, response) => {
	const { username, email, password } = await request.body;
	console.log(username, email, password);
	return response.status(201).json({ username, email, password });
};

const getUsers = (request, response) => {
	return response.status(200).json("all users");
};

export { postUser, getUsers };
