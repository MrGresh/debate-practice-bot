const { vapiAssistantsService } = require("../services");
const { getLogger } = require("../utils");
const logger = getLogger(module);

exports.listAssistants = async (req, res) => {
  try {
    const assistants = await vapiAssistantsService.listAssistants();

    res.status(200).json({
      success: true,
      message: "Vapi assistants retrieved successfully.",
      data: assistants,
    });
  } catch (error) {
    logger.error(`List Assistants Controller error: ${error.message}`);
    let statusCode = 500;

    if (error.message.includes("VAPI_PRIVATE_KEY is missing")) {
      statusCode = 400;
    } else if (
      error.message.includes("Unauthorized") ||
      error.message.includes("401")
    ) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAssistantById = async (req, res) => {
  try {
    const assistantId = req.params.id;

    if (!assistantId) {
      return res.status(400).json({
        success: false,
        message: "Assistant ID parameter is required.",
      });
    }

    const assistant = await vapiAssistantsService.getAssistantById(assistantId);

    res.status(200).json({
      success: true,
      message: `Vapi assistant '${assistantId}' retrieved successfully.`,
      data: assistant,
    });
  } catch (error) {
    logger.error(`Get Assistant Controller error: ${error.message}`);
    let statusCode = 500;

    if (error.message.includes("Assistant ID is required")) {
      statusCode = 400;
    } else if (error.message.includes("not found")) {
      statusCode = 404;
    } else if (
      error.message.includes("Unauthorized") ||
      error.message.includes("401")
    ) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAssistantById = async (req, res) => {
  try {
    const assistantId = req.params.id;

    if (!assistantId) {
      return res.status(400).json({
        success: false,
        message: "Assistant ID parameter is required for deletion.",
      });
    }

    await vapiAssistantsService.deleteAssistantById(assistantId);

    res.status(200).json({
      success: true,
      message: `Vapi assistant '${assistantId}' successfully deleted.`,
    });
  } catch (error) {
    logger.error(`Delete Assistant Controller error: ${error.message}`);
    let statusCode = 500;

    if (error.message.includes("Assistant ID is required")) {
      statusCode = 400;
    } else if (
      error.message.includes("not found") ||
      error.message.includes("already deleted")
    ) {
      statusCode = 404;
    } else if (
      error.message.includes("Unauthorized") ||
      error.message.includes("401")
    ) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
