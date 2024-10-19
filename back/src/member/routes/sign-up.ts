import express from "express";
import signUpController from "src/member/modules/sign-up/sign-up-controller";

const router = express.Router();

router.post('/sign-up', signUpController.signUp);

export default router;
