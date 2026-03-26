import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;
const telemetryEventSchema = new mongoose.Schema({

  userId: { 
    type: String, 
    ref: 'User', 
    index: true,
    sparse: true // Allows null for guest/unauthenticated telemetry
  },
  
  sessionId: { 
    type: String, 
    index: true 
  },

  // --- SNAPSHOT DATA (Immutable) ---
  ipAddress: { 
    type: String,
    trim: true 
  },
  
  userAgent: { 
    type: String 
  },
  
  screenResolution: { 
    type: String 
  },
  
  language: { 
    type: String,
    lowercase: true 
  },
  
  referrer: { 
    type: String 
  },

  // --- LIFECYCLE ---
  // MongoDB handles high-precision dates natively
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: { expires: '30d' } // Auto-delete telemetry after 30 days to save space
  }

}, { 
  // Disable versionKey (__v) and timestamps since telemetry is immutable
  versionKey: false, 
  timestamps: false, 
  collection: 'telemetry_events' 
});

// --- INDEXES ---
// Compound index for analyzing a specific user's journey over time
telemetryEventSchema.index({ userId: 1, timestamp: -1 });



const TelemetryEvent = mongoose.model("TelemetryEvent", telemetryEventSchema);
export { TelemetryEvent };
