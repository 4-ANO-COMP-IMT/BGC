import express from "express";
import userController from "src/member/modules/user/user-controller";

const router = express.Router();

router.get('/user', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);

export default router;
