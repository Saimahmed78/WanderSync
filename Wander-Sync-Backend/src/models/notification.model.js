import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', index: true },
  
  type: { type: String, enum: ['EMAIL', 'SMS', 'PUSH'], required: true },
  purpose: { 
    type: String, 
    enum: ['REGISTRATION', 'VERIFICATION', 'WELCOME', 'PASSWORD_RESET', 'ALERT', 'OTHER'] 
  },
  recipient: { type: String, required: true }, // Email or Phone
  
  subject: String,
  bodyPreview: String,
  
  // Dynamic template data (e.g., { link: "...", name: "Ali" })
  metadata: { type: mongoose.Schema.Types.Mixed }, 

  status: { 
    type: String, 
    enum: ['QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED'], 
    default: 'QUEUED' 
  },
  provider: { type: String, default: 'Brevo' },
  messageId: String, // ID from External Provider (SendGrid/AWS SES)
  errorMessage: String,
  sentAt: Date
}, { 
  timestamps: true,
});

// --- INDEXES ---
// Optimized index for the background worker to find messages to send
notificationSchema.index({ status: 1, createdAt: 1 });
// Compound index for user history lookups
notificationSchema.index({ userId: 1, status: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
