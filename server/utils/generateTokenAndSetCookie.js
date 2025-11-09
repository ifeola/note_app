import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (response, id) => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	response.cookie("authToken", token, {
		httpOnly: true, // Cannot be accessed by JavaScript. Prevents an attack called "xss"
		secure: process.env.NODE_ENV == "production",
		sameSite: "strict", // Prevents an attack called "cfrh"
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};
