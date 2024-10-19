-- DropEnum
DROP TYPE "crdb_internal_region";

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "cpf" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "company" STRING,
    "role" STRING,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" STRING NOT NULL,
    "members_id" STRING[],
    "host_id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transcription_id" STRING,
    "record_id" STRING,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcription" (
    "id" STRING NOT NULL,
    "id_metting" STRING NOT NULL,
    "transcription" STRING NOT NULL,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" STRING NOT NULL,
    "id_metting" STRING NOT NULL,
    "recod_file" BYTES NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
