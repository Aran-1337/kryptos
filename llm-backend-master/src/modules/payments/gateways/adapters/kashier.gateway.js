const crypto = require('crypto');
const BasePaymentGateway = require('../base.gateway');
const AppError = require('../../../../utils/AppError');

/**
 * Kashier Payment Gateway Adapter
 * Implements the BasePaymentGateway specification for Kashier (v3 Payment Sessions & Webhooks).
 */
class KashierGateway extends BasePaymentGateway {
  constructor(config = {}) {
    super('kashier');
    this.merchantId = config.merchantId !== undefined ? config.merchantId : process.env.KASHIER_MERCHANT_ID;
    this.paymentApiKey = config.paymentApiKey !== undefined ? config.paymentApiKey : process.env.KASHIER_PAYMENT_API_KEY;
    this.secretApiKey = config.secretApiKey !== undefined ? config.secretApiKey : process.env.KASHIER_SECRET_API_KEY;
    this.environment = ((config.environment !== undefined ? config.environment : process.env.KASHIER_ENVIRONMENT) || 'test').toLowerCase();
    this.testBaseUrl = (config.testBaseUrl !== undefined ? config.testBaseUrl : process.env.KASHIER_TEST_BASE_URL) || 'https://test-api.kashier.io';
    this.liveBaseUrl = (config.liveBaseUrl !== undefined ? config.liveBaseUrl : process.env.KASHIER_LIVE_BASE_URL) || 'https://api.kashier.io';
    this.clientUrl = (config.clientUrl !== undefined ? config.clientUrl : process.env.CLIENT_URL) || 'http://localhost:3000';
  }

  /**
   * Create Kashier v3 Payment Session
   * Server-side authoritative checkout URL / session creation.
   */
  async createPaymentSession(payment, order, user = {}) {
    if (!this.merchantId || !this.paymentApiKey || !this.secretApiKey) {
      throw new AppError('بوابة Kashier غير مهيأة: بيانات الاعتماد غير متوفرة', 503);
    }

    const baseUrl = this.environment === 'live' ? this.liveBaseUrl : this.testBaseUrl;
    const merchantOrderId = payment._id ? payment._id.toString() : String(order._id);
    const amountStr = Number(payment.amount).toFixed(2);
    const currency = (payment.currency || 'EGP').toUpperCase();

    const payload = {
      amount: amountStr,
      currency,
      order: merchantOrderId,
      merchantId: this.merchantId,
      merchantRedirect: `${this.clientUrl}/dashboard/orders?orderId=${order._id}&paymentId=${payment._id}`,
      type: 'one-time',
      allowedMethods: 'card,wallet',
      customer: {
        email: user?.email || 'student@mnasa.com',
        reference: user?._id?.toString() || payment.user?.toString(),
      },
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      maxFailureAttempts: 3,
    };

    try {
      const response = await fetch(`${baseUrl}/v3/payment/sessions`, {
        method: 'POST',
        headers: {
          Authorization: this.secretApiKey,
          'api-key': this.paymentApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kashier API responded with HTTP ${response.status}: ${errorText}`);
      }

      const resData = await response.json();
      const sessionId = resData.sessionId || resData.id || resData.data?.sessionId;
      const checkoutUrl = resData.sessionUrl || resData.checkoutUrl || resData.data?.sessionUrl;
      const gatewayOrderId = resData.orderReference || resData.order || merchantOrderId;

      if (!sessionId || !checkoutUrl) {
        throw new AppError('استجابة بوابة Kashier غير مكتملة: لم يتم استلام معرف الجلسة أو رابط الدفع المطلوب', 502);
      }

      return {
        gateway: 'kashier',
        sessionId,
        checkoutUrl,
        gatewayOrderId,
        rawResponse: {
          sessionId,
          checkoutUrl,
          gatewayOrderId,
        },
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(`فشل إنشاء جلسة الدفع لدى بوابة Kashier: ${err.message}`, 502);
    }
  }

  /**
   * Cryptographically verify incoming Kashier webhook
   * Uses HMAC-SHA256 with data.signatureKeys and constant-time comparison
   */
  verifyWebhook(headers = {}, body = {}, rawBody = null) {
    const secretKey = this.secretApiKey;
    if (!secretKey) {
      throw new AppError('بوابة Kashier غير مهيأة (مفتاح التحقق من الـ Webhook غير متوفر)', 503);
    }

    const signature = headers['x-kashier-signature'] || headers['X-Kashier-Signature'];
    if (!signature) {
      throw new AppError('توقيع إشعار Kashier مفقود (x-kashier-signature)', 400);
    }

    let isValid = false;
    const data = body?.data;

    // Algorithm 1: Kashier signatureKeys concatenation
    if (data && Array.isArray(data.signatureKeys) && data.signatureKeys.length > 0) {
      const queryString = data.signatureKeys
        .map((key) => `${key}=${data[key] !== undefined && data[key] !== null ? data[key] : ''}`)
        .join('&');

      const computedHmac = crypto
        .createHmac('sha256', secretKey)
        .update(queryString)
        .digest('hex');

      if (
        computedHmac.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(computedHmac, 'utf8'), Buffer.from(signature, 'utf8'))
      ) {
        isValid = true;
      }
    }

    // Algorithm 2: Direct raw body HMAC (fallback for raw body signatures)
    if (!isValid && rawBody) {
      const rawComputed = crypto
        .createHmac('sha256', secretKey)
        .update(rawBody)
        .digest('hex');

      if (
        rawComputed.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(rawComputed, 'utf8'), Buffer.from(signature, 'utf8'))
      ) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new AppError('توقيع إشعار Kashier غير صالح', 400);
    }

    return true;
  }

  /**
   * Parse Kashier webhook payload into internal NormalizedPaymentEvent format
   */
  parseWebhookEvent(body = {}) {
    const data = body?.data || body || {};
    const eventType = body?.event || 'pay';

    const merchantOrderId = data.merchantOrderId || data.orderId || data.order;
    const gatewayTransactionId = data.transactionId || data.id;
    const gatewayOrderId = data.orderReference || data.gatewayOrderId || merchantOrderId;
    const rawStatus = String(data.status || '').toUpperCase();

    let normalizedStatus = 'pending';
    if (rawStatus === 'SUCCESS') {
      normalizedStatus = 'succeeded';
    } else if (rawStatus === 'FAILURE' || rawStatus === 'FAILED') {
      normalizedStatus = 'failed';
    } else if (rawStatus === 'PENDING') {
      normalizedStatus = 'pending';
    }

    // Unique event identifier for idempotency
    const eventId = String(gatewayTransactionId || data.orderReference || body.id || `${merchantOrderId}_${Date.now()}`);

    return {
      gateway: 'kashier',
      eventId,
      eventType,
      merchantOrderId,
      paymentId: merchantOrderId,
      gatewayTransactionId: gatewayTransactionId ? String(gatewayTransactionId) : undefined,
      gatewayOrderId: gatewayOrderId ? String(gatewayOrderId) : undefined,
      status: normalizedStatus,
      amount: data.amount !== undefined ? Number(data.amount) : undefined,
      currency: (data.currency || 'EGP').toUpperCase(),
      failureReason:
        data.failureReason ||
        data.responseDescription ||
        (normalizedStatus === 'failed' ? 'فشلت عملية الدفع لدى البوابة' : undefined),
      paymentData: {
        gateway: 'kashier',
        kashierTransactionId: gatewayTransactionId,
        kashierOrderReference: gatewayOrderId,
        method: data.paymentMethod || 'card',
      },
      rawPayload: body,
    };
  }

  /**
   * Refund operation
   */
  async refundPayment(payment, amount) {
    throw new AppError('عملية الاسترجاع التلقائي لبوابة Kashier قيد الإعداد للمرحلة القادمة', 501);
  }
}

module.exports = KashierGateway;
