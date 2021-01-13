import express, { json } from "express";
import cors from "cors";
import { connection } from "./db";
import UserRouter from "./routes/UserRouter";

const app = express();
app.use(cors());
app.use(json());

const port = process.env.PORT || 5000;

connection.once("open", () => {
  console.log("DB Connected!");
});

app.use("/user", UserRouter);

app.listen(port, () => {
  console.log("app is listning on port: " + port);
});
