import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI({
  apiKey: "Insert Gemini API",
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imageBase64 = fs.readFileSync(req.file.path, {
      encoding: "base64",
    });

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: imageBase64,
          },
        },
        {
          text: "Analyze this X-ray image carefully. Describe all visible abnormalities, patterns, or unusual areas. Based on your analysis, indicate if there are any signs that might suggest the presence of cancer. Note: This is not a medical diagnosis and should not replace consultation with a professional doctor.",
        },
      ],
    });

    fs.unlinkSync(req.file.path);

    res.json({ summary: result.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Image analysis failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
