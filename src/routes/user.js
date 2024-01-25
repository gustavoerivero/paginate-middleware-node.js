import express from "express";

import paginate from "../middlewares/paginate.js";
import User from "../models/User.js";
import { getUsers } from "../controllers/cUser.js";

const router = express.Router();

router.get("/", paginate(User), getUsers);

export default router;