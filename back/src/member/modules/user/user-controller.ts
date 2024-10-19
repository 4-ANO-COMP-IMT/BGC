import { Request, Response } from "express";
import database from "src/infra/database";
import { Publisher } from "src/shared/RabbitMQ/publisher";
import { z } from "zod";

// Inicializando publishers para as filas de eventos
const publisherGetAllUsers = new Publisher('getallUsers_queue');
const publisherGetUserById = new Publisher('getUserById_queue');

// Conectando ambos os publishers (somente uma vez)
publisherGetAllUsers.connect();
publisherGetUserById.connect();

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await database.query(`SELECT * FROM "User";`);
    const users = response?.rows || [];

    // Publicando o evento de obtenção de todos os usuários
    const eventMessage = JSON.stringify({
      timestamp: new Date().toISOString(),
      eventType: 'get_all_users',
      userCount: users.length,
    });
    await publisherGetAllUsers.publish(eventMessage);

    res.status(201).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const response = await database.query(
      `SELECT * FROM "User" WHERE id = $1`,
      [userId],
    );

    const user = response?.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid id." });
    }

    // Publicando o evento de obtenção de usuário por ID
    const eventMessage = JSON.stringify({
      id: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
      eventType: 'get_user_by_id',
    });
    await publisherGetUserById.publish(eventMessage);

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { getAllUsers, getUserById };
