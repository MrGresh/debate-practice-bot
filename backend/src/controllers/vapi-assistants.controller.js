const { vapiAssistantsService } = require("../services");
const { VAPI_CONFIG } = require("../constants");
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

exports.saveCallId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({
        success: false,
        message: 'Missing Call ID in webhook body.',
      });
    }

    await vapiAssistantsService.saveCallStart(callId, userId);

    res.status(200).json({
      success: true,
      message: `Call log started for Call ID: ${callId}`,
    });
  } catch (error) {
    let statusCode = error.message.includes('already exists') ? 409 : 500; 

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.setCallUnderEvaluation = async (req, res) => {
  try {
    const { callId } = req.body;
    const userId = req.user._id;
    if (!callId) {
      return res.status(400).json({
        success: false,
        message: 'Missing Call ID parameter.',
      });
    }

    const updatedCall = await vapiAssistantsService.updateCallStatusToUnderEvaluation(callId, userId);

    res.status(200).json({
      success: true,
      message: `Call log status for ID ${callId} updated to UNDER_EVALUATION.`,
    });
  } catch (error) {
    logger.error(`Set Call Under Evaluation Controller error: ${error.message}`);
    let statusCode = error.message.includes('not found') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.storeCallReport = async (req, res) => {
  const receivedPasskey = req.headers['vapi-passkey'];
  const VAPI_PASSKEY = VAPI_CONFIG.VAPI_PASSKEY;
  if (receivedPasskey != VAPI_PASSKEY) {
    logger.warn('Unauthorized access attempt: Invalid or missing vapi-passkey');
    return res.status(401).json({ error: 'Unauthorized: Invalid VAPI Passkey' });
  }
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'data is required' });
  try {
    await vapiAssistantsService.updateCallEndReport(message); 

    res.status(200).json({
      success: true,
      message: `Call report for ID ${message?.call?.id} stored successfully.`,
    });
  } catch (error) {
    let statusCode = error.message.includes('not found') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
