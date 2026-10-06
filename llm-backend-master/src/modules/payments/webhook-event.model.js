const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema(
  {
    gateway: {
      type: String,
      enum: ['kashier', 'paymob', 'fawry', 'stripe', 'manual'],
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    gatewayTransactionId: {
      type: String,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['received', 'processed', 'failed', 'ignored'],
      default: 'received',
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Guarantee exact-once processing per gateway event via unique compound index
webhookEventSchema.index({ gateway: 1, eventId: 1 }, { unique: true });
webhookEventSchema.index({ receivedAt: -1 });

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
