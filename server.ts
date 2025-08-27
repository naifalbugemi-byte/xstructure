import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Ping test
app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "XSTRUCTURE API Running 🚀" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Express server running at http://localhost:${PORT}`));
