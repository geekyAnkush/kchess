import { Router } from "express";
import games from "./games.route.js";
import auth from "./auth.route.js";
import gun from "./gun.route.js";

const router = Router();

router.use("/games", games);
router.use("/gun", gun);
router.use("/auth", auth);

export default router;
