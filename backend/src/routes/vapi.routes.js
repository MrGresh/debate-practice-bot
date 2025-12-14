const express = require("express");
const { vapiController } = require("../controllers");

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post("/webhook", vapiController.storeCallReport);

protectedRouter.get("/list", vapiController.listAssistants);
protectedRouter.get("/:id", vapiController.getAssistantById);
protectedRouter.delete("/:id", vapiController.deleteAssistantById);
protectedRouter.post("/save-call-id", vapiController.saveCallId);
protectedRouter.post("/set-call-under-evaluation", vapiController.setCallUnderEvaluation);
protectedRouter.post("/fetch-call-logs", vapiController.fetchCallLogs);

module.exports = {
  protectedRoutes: protectedRouter,
  publicRoutes: publicRouter,
};
