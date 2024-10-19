import express, { Express } from "express";
import dotenv from "dotenv";
import status from "src/member/routes/status";
import signIn from "src/member/routes/sign-in";
import signUp from "src/member/routes/sign-up";
import user from "src/member/routes/user";
import resume from "src/transcription/routes/resume";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import handleSocketEvents from "./socket/socket";
import { prisma } from "./models/prisma";
import { randomUUID } from "crypto";

// async function teste() {
//   // const user = await prisma.user.create({
//   //   data: {
//   //     name: "Gabriel cria",
//   //     cpf: "234314211235",
//   //     email: "123nfwi@terra.com.br",
//   //     password: "teste",
//   //   },
//   // });

//   const users = await prisma.user.deleteMany();

//   console.log(users);
// }

// teste();

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const FRONT_PORT = 5173;

app.use(
  cors({
    origin: [`http://localhost:5173`, `http://localhost:5174`],
    methods: ["GET", "POST", "DELETE"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(status);
app.use(signIn);
app.use(signUp);
app.use(user);
app.use(resume);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [`http://localhost:5173`, `http://localhost:5174`],
    methods: ["GET", "POST"],
  },
});

handleSocketEvents(io);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
