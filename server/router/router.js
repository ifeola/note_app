import { Router } from "express";
import { signup, signin, getUsers } from "../controller/controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/users", verifyJWT, getUsers);

export default router;
