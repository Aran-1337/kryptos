const AppError = require('../../../utils/AppError');

/**
 * Base Payment Gateway Contract
 * Generic interface that all gateway adapters (Kashier, Paymob, Fawry, Stripe) must extend.
 */
class BasePaymentGateway {
  constructor(name) {
    this.name = name;
  }

  async createPaymentSession(payment, order) {
    throw new AppError(`createPaymentSession not implemented for gateway ${this.name}`, 501);
  }

  verifyWebhook(req) {
    throw new AppError(`verifyWebhook not implemented for gateway ${this.name}`, 501);
  }

  parseWebhookEvent(req) {
    throw new AppError(`parseWebhookEvent not implemented for gateway ${this.name}`, 501);
  }

  async queryPaymentStatus(gatewayTransactionId) {
    throw new AppError(`queryPaymentStatus not implemented for gateway ${this.name}`, 501);
  }

  async refundPayment(payment, amount) {
    throw new AppError(`refundPayment not implemented for gateway ${this.name}`, 501);
  }
}

module.exports = BasePaymentGateway;
