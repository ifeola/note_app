import express from "express";
import { getUsers } from "../controller/controller.js";

const router = express.Router();

router.get("/users", getUsers);

export default router;
