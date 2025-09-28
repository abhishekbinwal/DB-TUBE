import { Router } from "express";

import { registerUser } from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 5 },
    {
      name: "coverImage",
      maxCount: 5,
    },
  ]),
  registerUser
);
export default router;
