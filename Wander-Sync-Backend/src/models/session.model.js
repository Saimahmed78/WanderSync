import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const sessionSchema = new mongoose.Schema({
  // --- 1. REFERENCES ---
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  
  deviceId: { 
    type: String, 
    required: true, 
    index: true 
  },

  // --- 2. SECURITY TOKENS ---
  refreshToken: { 
    type: String, 
    unique: true, 
    sparse: true // Allows nulls while keeping uniqueness for non-null values
  },

  // Embedded Revoked Tokens (equivalent to your RevokedToken model/array)
  revokedTokens: [{
    token: { type: String, required: true },
    revokedAt: { type: Date, default: Date.now }
  }],

  // --- 3. PARSED UI DATA ---
  browserName: String,
  osName: String,
  deviceType: { 
    type: String, 
    enum: ['MOBILE', 'TABLET', 'DESKTOP', 'UNKNOWN'], 
    default: 'UNKNOWN' 
  },
  deviceModel: String,
  location: String,

  // --- 4. RAW DATA ---
  ipAddress: String, // Stored as string in MongoDB
  userAgent: String,

  // --- 5. LIFECYCLE ---
  issuedAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expires: 0 } // MAGIC: TTL Index - Mongo will auto-delete this doc when current time > expiresAt
  },
  revokedAt: Date,
  lastActiveAt: { 
    type: Date, 
    default: Date.now 
  },
  revokedReason: String

}, { 
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// --- INDEXES ---
// Combined index for security lookups (Is this session valid for this user?)
sessionSchema.index({ userId: 1, deviceId: 1 });

const Session = mongoose.model('Session', sessionSchema);
export { Session };