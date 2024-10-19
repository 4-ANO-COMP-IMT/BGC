import express from "express";
import statusController from "src/member/modules/status/status-controller";

const router = express.Router();

router.route("/status").get(statusController.getStatus);

export default router;
