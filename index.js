import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { WebPubSubServiceClient } from "@azure/web-pubsub";

import connectDB from "./utils/connectDB.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import forumRouter from "./routes/forum.routes.js";

dotenv.config();
const { PORT, MONGO_URI, PUBSUB_URI, ALLOWED_ORIGINS } = process.env;

const app = express();
let serviceClient = null;

const corsOptions = {
  origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
}

// Initialize Azure PubSub only if credentials are provided
if (PUBSUB_URI && PUBSUB_URI !== 'your_azure_pubsub_connection_string_here') {
  try {
    serviceClient = new WebPubSubServiceClient(PUBSUB_URI, "farmap");
    console.log('Azure Web PubSub initialized');
  } catch (error) {
    console.warn('Azure Web PubSub not configured, running without real-time messaging');
  }
} else {
  console.warn('Azure Web PubSub not configured, running without real-time messaging');
}

// database connection
connectDB(MONGO_URI);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use(cors(corsOptions));

// api routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/seller", sellerRouter);
app.use("/forum", forumRouter);

app.get("/", (req, res) => {
  res.send("Farmap backend service.");
});

app.get("/negotiate", async (req, res) => {
  if (!serviceClient) {
    res.status(503).json({ error: "Real-time messaging not configured" });
    return;
  }
  let id = req.query.id;
  if (!id) {
    res.status(400).send("missing user id");
    return;
  }
  let token = await serviceClient.getClientAccessToken({ userId: id });
  res.json({
    url: token.url,
  });
});

app.listen(PORT, () => {
  console.log(`Farmap backend service is listening on port ${PORT}.`);
});

export { serviceClient };
