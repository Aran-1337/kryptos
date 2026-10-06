const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gateway: {
      type: String,
      enum: ['kashier', 'paymob', 'fawry', 'stripe', 'manual'],
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'unknown',
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'المبلغ لا يمكن أن يكون سالباً'],
    },
    currency: {
      type: String,
      default: 'EGP',
      uppercase: true,
    },
    status: {
      type: String,
      enum: [
        'created',
        'pending',
        'processing',
        'requires_action',
        'succeeded',
        'failed',
        'cancelled',
        'expired',
        'refunded',
        'partially_refunded',
      ],
      default: 'pending',
      index: true,
    },
    gatewayTransactionId: {
      type: String,
      index: true,
    },
    gatewayOrderId: {
      type: String,
      index: true,
    },
    checkoutSessionId: {
      type: String,
      index: true,
    },
    failureReason: {
      type: String,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    paidAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ order: 1, createdAt: -1 });
paymentSchema.index({ user: 1, status: 1 });

paymentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.gatewayResponse && typeof obj.gatewayResponse === 'object') {
    delete obj.gatewayResponse.secret;
    delete obj.gatewayResponse.apiKey;
    delete obj.gatewayResponse.apiSecret;
    delete obj.gatewayResponse.secretApiKey;
    delete obj.gatewayResponse.paymentApiKey;
    delete obj.gatewayResponse.webhookSecret;
    delete obj.gatewayResponse.privateKey;
    for (const k of Object.keys(obj.gatewayResponse)) {
      if (/secret|private/i.test(k)) {
        delete obj.gatewayResponse[k];
      }
    }
  }
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Payment', paymentSchema);
