import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import router from "./router/router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client")));
app.use("api/v1", router);

app.listen(PORT, () => {
	console.log(`Server running on localhost:${PORT}`);
});
