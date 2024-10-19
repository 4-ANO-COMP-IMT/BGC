import { config } from 'dotenv'

config()

type Environments = {
  POSTGRES_HOST: string
  EVENTBUS_PORT: string | number
  MEMBER_PORT: string | number
  TRANSCRIPTION_PORT: string | number
  POSTGRES_PORT: string | number
  POSTGRES_USER: string 
  POSTGRES_DB: string 
  POSTGRES_PASSWORD: string 
  DEV_DATABASE_URL: string
  PROD_DATABSE_URL: string
  OPEN_AI_KEY: string
  DATABASE_URL: string
}

export const environments: Environments = {
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  EVENTBUS_PORT: process.env.EVENT_PORT || 3000,
  MEMBER_PORT: process.env.MEMBER_PORT || 4000,
  TRANSCRIPTION_PORT: process.env.TRANSCRIPTION_PORT || 5000,
  POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
  POSTGRES_USER: process.env.POSTGRES_USER || 'local_user',
  POSTGRES_DB: process.env.POSTGRES_DB || 'local_db',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
  DEV_DATABASE_URL: process.env.DEV_DATABASE_URL || '',
  PROD_DATABSE_URL: process.env.PROD_DATABSE_URL || '',
  OPEN_AI_KEY: process.env.OPEN_AI_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || ''
}