const AppError = require('../../../utils/AppError');
const KashierGateway = require('./adapters/kashier.gateway');
const config = require('../../../config');

const SUPPORTED_GATEWAYS = ['kashier', 'paymob', 'fawry', 'stripe', 'manual'];

class PaymentGatewayFactory {
  static get(gatewayName) {
    if (!gatewayName || typeof gatewayName !== 'string') {
      throw new AppError('معرف بوابة الدفع مطلوب', 400);
    }

    const normalized = gatewayName.trim().toLowerCase();

    if (!SUPPORTED_GATEWAYS.includes(normalized)) {
      throw new AppError(`بوابة الدفع "${gatewayName}" غير مدعومة`, 400);
    }

    if (normalized === 'kashier') {
      return new KashierGateway(config.kashier);
    }

    // Paymob, Fawry, Stripe remain UNIMPLEMENTED in Phase 4C.4
    // Return a controlled 501 error rather than fake success.
    throw new AppError(`بوابة الدفع "${normalized}" قيد الإعداد ولم يتم تفعيلها بعد`, 501);
  }

  static getSupportedGateways() {
    return [...SUPPORTED_GATEWAYS];
  }

  static isSupported(gatewayName) {
    if (!gatewayName || typeof gatewayName !== 'string') return false;
    return SUPPORTED_GATEWAYS.includes(gatewayName.trim().toLowerCase());
  }
}

module.exports = PaymentGatewayFactory;
