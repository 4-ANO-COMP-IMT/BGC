import OpenAI from "openai";
import { env } from "process";

export const openai = new OpenAI({
  apiKey: env.OPEN_AI_KEY,
});
