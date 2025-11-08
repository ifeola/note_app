import { v4 as uuid } from "uuid";
import pool from "../database/database.js";

const getUsers = (request, response) => {
	const { username, email, password } = request.body;
	console.log(username, email, password);
};

export { getUsers };
