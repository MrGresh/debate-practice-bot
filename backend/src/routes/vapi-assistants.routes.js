const express = require("express");
const { vapiAssistantsController } = require("../controllers");

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post("/webhoook", vapiAssistantsController.storeCallReport);

protectedRouter.get("/list", vapiAssistantsController.listAssistants);
protectedRouter.get("/:id", vapiAssistantsController.getAssistantById);
protectedRouter.delete("/:id", vapiAssistantsController.deleteAssistantById);

protectedRouter.post("/save-call-id", vapiAssistantsController.saveCallId);
protectedRouter.post("/set-call-under-evaluation", vapiAssistantsController.setCallUnderEvaluation);

module.exports = {
  protectedRoutes: protectedRouter,
  publicRoutes: publicRouter,
};
