const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema(
  {
    callId: {
      type: String,
      required: true,
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
    recordingUrl: {
      type: String,
      required: false,
    },
    cost: {
      type: Number,
      required: false,
    },
    durationMinutes: {
      type: Number,
      required: false,
    },
    summary: {
      type: String,
      required: false,
    },
    transcript: [
      {
        role: {
          type: String,
          required: false,
        },
        message: {
          type: String,
          required: false,
        },
        time: {
          type: Number,
          required: false,
        },
        endTime: {
          type: Number,
          required: false,
        },
      },
    ],
    call_report: {
      coherence_score: {
        type: Number,
        required: false,
      },
      overall_debate_score: {
        type: Number,
        required: false,
      },
      argument_clarity_score: {
        type: Number,
        required: false,
      },
      evidence_quality_score: {
        type: Number,
        required: false,
      },
      emotional_tone_evaluation: {
        type: String,
        required: false,
      },
      pacing_evaluation: {
        type: String,
        required: false,
      },
      primary_strength: {
        type: String,
        required: false,
      },
      primary_weakness: {
        type: String,
        required: false,
      },
      fallacies: {
        list: {
          type: [String],
          required: false,
        },
        count: {
          type: Number,
          required: false,
        },
      },
    },
    startedAt: { 
      type: Date, 
      required: false, 
      default: null 
    },
    endedAt: { 
      type: Date, 
      required: false, 
      default: null 
    },
    status: {
      type: String,
      required: true,
      enum: ['STARTED', 'EVALUATING', 'EVALUATED'],
      default: 'STARTED',
    },
  },
  {
    timestamps: true,
  }
); 

module.exports = mongoose.model("CallLog", callLogSchema);