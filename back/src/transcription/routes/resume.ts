import express from "express";
import multer from "multer";
import transcribeController from "src/transcription/controller/resume-controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/transcribe",
  upload.single("file"),
  transcribeController.transcribeAudio,
);

router.get("/transcribe", transcribeController.getAllTranscribe);
router.get("/transcribe/:id", transcribeController.generateResume);
router.delete("/transcribe", transcribeController.deleteAllTranscribe);

export default router;
