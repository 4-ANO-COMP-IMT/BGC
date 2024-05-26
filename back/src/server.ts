import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import user from "./controllers/user";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(user);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
