import cors from "cors";
import express from "express";
import signUpRoutes from "src/member/routes/sign-up";
import signInRoutes from "src/member/routes/sign-in";
import userRoutes from "src/member/routes/user";
import { environments } from "src/shared/env/environments";
import { Subscriber } from "src/shared/RabbitMQ/subscriber";
import { Publisher } from "src/shared/RabbitMQ/publisher";

const app = express();
app.use(express.json());
app.use(cors());

// Rotas
app.use("/", signUpRoutes);
app.use("/", signInRoutes);
app.use("/", userRoutes);

// Inicializando subscribers
const signUpSubscriber = new Subscriber("signup_queue", (message) => {
  console.log("Processed signup event:", message);
  // Processamento adicional, como enviar email de boas-vindas
});
signUpSubscriber.connect();

const signInSubscriber = new Subscriber("signin_queue", (message) => {
  console.log("Processed signin event:", message);
  // Processamento adicional para eventos de sign-in
});
signInSubscriber.connect();

const AllUsersSubscriber = new Subscriber("getallUsers_queue", (message) => {
  console.log("Processed get_all_users event:", message);
  // Processamento adicional para eventos de obtenção de todos os usuários
});
AllUsersSubscriber.connect();

const UserByIdSubscriber = new Subscriber("getUserById_queue", (message) => {
  console.log("Processed get_user_by_id event:", message);
  // Processamento adicional para eventos de obtenção de usuário por ID
});
UserByIdSubscriber.connect();

// Inicializando o servidor
const PORT = environments.MEMBER_PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Fechando conexões do RabbitMQ ao encerrar o servidor
process.on("SIGINT", async () => {
  console.log("Closing RabbitMQ connections...");
  await signUpSubscriber.close();
  await signInSubscriber.close();
  await AllUsersSubscriber.close();
  await UserByIdSubscriber.close();
  server.close(() => {
    console.log("Server shut down");
    process.exit(0);
  });
});
