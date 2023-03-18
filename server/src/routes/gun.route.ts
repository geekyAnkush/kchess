import { Router } from "express";
import * as controller from "../controllers/gun.controller.js";

const router = Router();

router.route("/store").post(controller.storeValues);
router.route("/show").get(controller.showValues);

export default router;
