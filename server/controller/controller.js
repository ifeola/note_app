import { v4 as uuid } from "uuid";
import pool from "../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";

const signup = async (request, response) => {
	const { username, email, password } = request.body;

	try {
		if (!username || !email || !password)
			return response.status(400).send("All fields are required.");

		const userAlreadyExists = await pool.query(
			`SELECT * FROM users WHERE email = $1`,
			[email]
		);

		if (userAlreadyExists.rows.length > 0)
			return response
				.status(400)
				.json({ success: false, message: "User already exists" });

		// Hash Password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Generate a user id
		const id = uuid();

		// Generate a verification token to verify the user
		const verificationToken = generateVerificationToken();
		const verificationTokenExpiresAt = new Date(
			Date.now() + 24 * 60 * 60 * 1000
		);
		// Insert user in the database
		const user = await pool.query(
			`INSERT INTO users (id, username, email, password_hash, verification_token, verification_token_expires)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING id, username, email`,
			[
				id,
				username,
				email,
				hashedPassword,
				verificationToken,
				verificationTokenExpiresAt,
			]
		);

		const newUser = user.rows[0];

		// Generate JWT
		generateTokenAndSetCookie(response, newUser.id);

		await sendVerificationEmail(newUser.email, verificationToken);

		return response.status(201).json({
			success: true,
			message: "User created successfully",
			user: newUser,
		});
	} catch (error) {
		return response
			.status(500)
			.json({ message: false, message: error.message });
	}
};

const signin = async (request, response) => {
	const { username, password } = request.body;

	try {
		if (!username || !password)
			return response.status(400).json({ message: "Fill in the blank fields" });

		const checkUser = await pool.query(
			`SELECT * FROM users WHERE username = $1`,
			[username]
		);

		if (checkUser.rows.length === 0)
			return response
				.status(401)
				.json({ message: "You've provided wrong information." });

		const isPassword = await bcrypt.compare(
			password,
			checkUser.rows[0].password_hash
		);

		if (isPassword) {
			console.log("User is logged in.");
			const accessToken = jwt.sign(
				{ username },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "30s" }
			);

			const refereshToken = jwt.sign(
				{ username },
				process.env.REFERESH_TOKEN_SECRET,
				{ expiresIn: "1d" }
			);

			const newUser = await pool.query(
				`UPDATE users SET access_token = $1, referesh_token = $2 WHERE username = $3`,
				[accessToken, refereshToken, username]
			);

			response.cookie("jwt", refereshToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
			});

			return response.status(200).json({
				message: `User ${username} logged in successfully.`,
				accessToken,
				user: checkUser.rows[0],
			});
		} else {
			console.log("Wrong password.");
			return response.status(403).json({
				message: "User provided incorrect password.",
			});
		}
	} catch (error) {
		console.log(error.message);
		return response.status(500).json({ message: error.message });
	}
};

const verifyEmail = async (request, response) => {};

const getUsers = async (request, response) => {
	const users = await pool.query(`SELECT * FROM users`);
	if (users.rows.length === 0)
		return response.json({ message: "No users found" });
	return response
		.status(200)
		.json({ users: users.rows, length: users.rows.lenght });
};

export { signup, signin, getUsers, verifyEmail };
