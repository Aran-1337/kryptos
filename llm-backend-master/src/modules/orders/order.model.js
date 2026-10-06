const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemType: { type: String, enum: ['course', 'book'], required: true },
    item: { type: mongoose.Schema.Types.ObjectId, refPath: 'items.itemType', required: true },
    price: { type: Number, required: true },
    title: String,
  }],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String },
  paymentGateway: { type: String },
  transactionId: { type: String },
  paymentDetails: { type: mongoose.Schema.Types.Mixed },
  couponCode: { type: String },
  discountAmount: { type: Number, default: 0 },
}, { timestamps: true });

orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.paymentDetails && typeof obj.paymentDetails === 'object') {
    delete obj.paymentDetails.secret;
    delete obj.paymentDetails.apiKey;
    delete obj.paymentDetails.apiSecret;
    delete obj.paymentDetails.webhookSecret;
    delete obj.paymentDetails.privateKey;
  }
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Order', orderSchema);
