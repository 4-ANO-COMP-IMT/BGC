import cors from "cors";
import express from "express";
import resumeRoutes from "src/transcription/routes/resume";
import { environments } from "src/shared/env/environments";
import { Subscriber } from "src/shared/RabbitMQ/subscriber";
import { Server } from "socket.io";
import handleSocketEvents from "../socket/socket";

const app = express();
app.use(express.json());
app.use(cors());

// Rotas
app.use('/', resumeRoutes);


// Inicializando subscribers
const TranscriptionCreatedSubscriber = new Subscriber('signup_queue', (message) => {
  console.log('Processed signup event:', message);
});
TranscriptionCreatedSubscriber.connect();

const SummaryGeneratedSubscriber = new Subscriber('signin_queue', (message) => {
  console.log('Processed signin event:', message);
});
SummaryGeneratedSubscriber.connect();



// Inicializando o servidor
const PORT = environments.TRANSCRIPTION_PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Fechando conexões do RabbitMQ ao encerrar o servidor
process.on('SIGINT', async () => {
  console.log('Closing RabbitMQ connections...');
  await TranscriptionCreatedSubscriber.close();
  await SummaryGeneratedSubscriber.close();
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});

const io = new Server(server, {
  cors: {
    origin: [`http://localhost:5173`, `http://localhost:5174`],
    methods: ["GET", "POST"],
  },
});

handleSocketEvents(io);
