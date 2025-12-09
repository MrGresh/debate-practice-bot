const express = require("express");
const cors = require("cors");
const { connectMongo } = require("./src/config");
const { SERVER_CONFIG } = require("./src/constants");
const { initializeSchedulers } = require("./src/schedulers");

const apiRouter = require("./src/routes");

const app = express();

const corsOptions = {
  origin: SERVER_CONFIG.INTERVIEW_FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Backend application configuration is ready.");
});

app.use("/api/v1", apiRouter);

const startApp = async () => {
  try {
    await connectMongo();
    initializeSchedulers();
    return app;
  } catch (error) {
    console.error("Failed to connect to Mongo:", error);
    throw error;
  }
};

module.exports = startApp;
