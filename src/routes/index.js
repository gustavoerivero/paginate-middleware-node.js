import express from "express";

import rUser from "./user.js";

const router = express.Router();

router.use("/user", rUser);

export default router;