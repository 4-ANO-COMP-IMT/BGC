import express from "express";
import signInController from "src/member/modules/sign-in/sign-in-controller";

const router = express.Router();

router.post('/sign-in', signInController.signIn);

export default router;
