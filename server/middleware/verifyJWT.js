import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyJWT = (request, response, next) => {
	const authHeader = request.headers["authorization"];
	if (!authHeader) return response.sendStatus(401);

	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
		if (error) {
			console.log(error.message);
			return response.sendStatus(403);
		} // Invalid token

		request.user = decoded.username;
		next();
	});
};

export default verifyJWT;
