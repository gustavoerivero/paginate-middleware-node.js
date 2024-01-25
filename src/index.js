import express from "express";
import cors from "cors";
import morgan from "morgan";

import db from "./db/db.js";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/", routes);

db();

app.get("/", (_, res) => {
  res.json("Hello world!");
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});