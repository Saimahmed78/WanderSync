import mongoose from "mongoose";

const { Schema } = mongoose;

const oauthProviderSchema = new mongoose.Schema({
  // No auto-generated _id here if you want to use the composite as the key,
  // but it's cleaner in Mongoose to keep a standard _id and use a unique index.
  userId: { 
    type: String, 
    ref: 'User', 
    required: true, 
  },
  providerName: { 
    type: String, 
    enum: ['GOOGLE', 'GITHUB', 'FACEBOOK', 'TWITTER', 'LINKEDIN'],
    required: true
  },
  providerUserId: { 
    type: String, 
    required: true 
  },
  
  accessToken: { type: String, required: true },
  refreshToken: String,
  expiresAt: Date,
  scope: [String] // Array of strings (natively supported)

}, { 
  timestamps: true,
  
});

// Replicating Prisma's @@id([providerName, providerUserId])
oauthProviderSchema.index({ providerName: 1, providerUserId: 1 }, { unique: true });

// Lookup index for user
oauthProviderSchema.index({ userId: 1 });

const OAuthProvider = mongoose.model("OAuthProvider", oauthProviderSchema);
export { OAuthProvider };
