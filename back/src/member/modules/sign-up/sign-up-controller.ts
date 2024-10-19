import { Request, Response } from "express";
import database from "src/infra/database";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { Publisher } from "src/shared/RabbitMQ/publisher";  // Certifique-se de que o caminho do Publisher está correto

// Definindo o schema de validação para o corpo da requisição com o Zod
const SignUpSchema = z.object({
  name: z.string().min(3),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().optional(),
  role: z.string().optional(),
});

// Instanciando o Publisher para a fila "signup_queue"
const publisher = new Publisher('signup_queue');

const signUp = async (req: Request, res: Response) => {
  try {
    // Validando os dados da requisição
    const bodyValidated = SignUpSchema.parse(req.body);

    // Criptografando a senha antes de salvar no banco
    const passwordProtected = await bcrypt.hash(bodyValidated.password, 10);

    // Inserindo o novo usuário no banco de dados
    const response = await database.query(
      `INSERT INTO "User" (id, name, cpf, email, password, company, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, company, role;`,
      [
        uuid(), // Gerando um UUID para o usuário
        bodyValidated.name,
        bodyValidated.cpf,
        bodyValidated.email,
        passwordProtected,
        bodyValidated.company || null,
        bodyValidated.role || null,
      ],
    );

    // Pegando o usuário recém-criado e enviando como resposta
    const createdUser = response?.rows[0];

    // Conectando ao RabbitMQ e publicando uma mensagem na fila
    await publisher.connect();
    await publisher.publish(JSON.stringify({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      company: createdUser.company,
      role: createdUser.role,
    }));

    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    
    // Tratamento de erros: validação do Zod ou erro de servidor
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default { signUp };
