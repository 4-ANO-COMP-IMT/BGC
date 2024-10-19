import { Request, Response } from "express";
import fs from "fs";
import database from "src/infra/database";
import { openai } from "src/models/openai";
import { Publisher } from "src/shared/RabbitMQ/publisher";
import { v4 as uuid } from "uuid";

// Inicializando publishers para as filas de eventos
const publisherTranscriptionCreated = new Publisher('transcription_created_queue');
const publisherSummaryGenerated = new Publisher('summary_generated_queue');

// Conectando os publishers
publisherTranscriptionCreated.connect();
publisherSummaryGenerated.connect();

const transcribeAudio = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`File path: ${file.path}`);
    console.log(`File name: ${file.originalname}`);

    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const transcriptionText = transcriptionResponse.text;
    const idMeeting = req.body.meetingId;
    const transcriptionId = uuid();

    // Salvando a transcrição no banco de dados
    await database.query(
      `INSERT INTO "Transcription" (id, id_metting, transcription) VALUES ($1, $2, $3)`,
      [transcriptionId, idMeeting, transcriptionText],
    );

    // Publicando o evento de transcrição criada
    const transcriptionEvent = JSON.stringify({
      transcriptionId,
      meetingId: idMeeting,
      timestamp: new Date().toISOString(),
      eventType: 'transcription_created',
    });
    await publisherTranscriptionCreated.publish(transcriptionEvent);

    fs.unlinkSync(file.path);
    res.status(200).json({ message: "Transcription saved successfully" });
  } catch (error) {
    console.error("Error during transcription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllTranscribe = async (req: Request, res: Response) => {
  try {
    const response = await database.query(`SELECT * FROM "Transcription";`);
    const data = response?.rows;
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateResume = async (req: Request, res: Response) => {
  try {
    const meetingId = req.params.id;

    const response = await database.query(
      `SELECT * FROM "Transcription" WHERE id_metting = $1 ;`,
      [meetingId],
    );

    const transcriptions = response?.rows
      .map((row) => row.transcription)
      .join("\n\n");

    const prompt = `Você receberá uma série de transcrições de uma reunião. Sua tarefa é resumir detalhadamente o conteúdo, garantindo que o resumo capture a essência do que foi dito. O texto final deve ser completo, livre de espaços em branco ou informações vagas. Inclua pelo menos uma citação direta do texto original para dar contexto e evidência ao resumo. Evite generalidades e forneça um resumo que reflita precisamente as discussões e principais pontos abordados. Aqui estão as transcrições:\n\n${transcriptions}`;

    const resumeOpenAi = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const summary = resumeOpenAi.choices[0].text.trim();

    // Publicando o evento de resumo gerado
    const summaryEvent = JSON.stringify({
      meetingId,
      timestamp: new Date().toISOString(),
      eventType: 'summary_generated',
      summary,
    });
    await publisherSummaryGenerated.publish(summaryEvent);

    res.status(201).json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAllTranscribe = async (req: Request, res: Response) => {
  try {
    await database.query(`DELETE FROM "Transcription";`);
    res.status(201).json({ message: "All transcriptions deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  transcribeAudio,
  getAllTranscribe,
  deleteAllTranscribe,
  generateResume,
};
