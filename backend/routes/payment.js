import express from 'express';
import Order from '../models/Order.js';
import crypto from 'crypto';

const router = express.Router();

// ============================================
// SEPAY CONFIGURATION
// ============================================
// Đăng ký tại: https://my.sepay.vn
// Lấy API Key và cấu hình webhook URL
const SEPAY_CONFIG = {
  // Thông tin tài khoản ngân hàng nhận tiền
  BANK_ID: process.env.SEPAY_BANK_ID || 'MB', // Mã ngân hàng (MB, VCB, TCB, ACB...)
  ACCOUNT_NO: process.env.SEPAY_ACCOUNT_NO || '0935771670', // Số tài khoản
  ACCOUNT_NAME: process.env.SEPAY_ACCOUNT_NAME || 'NGUYEN HUU PHUOC', // Tên tài khoản
  
  // API Key từ SePay (để verify webhook)
  API_KEY: process.env.SEPAY_API_KEY || 'your-sepay-api-key',
  
  // Template nội dung chuyển khoản
  TEMPLATE: 'compact2' // compact, compact2, qr_only, print
};

// ============================================
// GENERATE QR CODE FOR PAYMENT
// ============================================
// GET /api/payment/qr/:orderId
router.get('/qr/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Nội dung chuyển khoản (quan trọng - dùng để match với webhook)
    // Format: DH + orderNumber để SePay có thể parse
    const transferContent = `DH${order.orderNumber}`;
    
    // Tạo URL QR VietQR
    // Docs: https://vietqr.io/danh-sach-api/link-tao-ma-qr
    const qrUrl = `https://qr.sepay.vn/img?` + new URLSearchParams({
      bank: SEPAY_CONFIG.BANK_ID,
      acc: SEPAY_CONFIG.ACCOUNT_NO,
      template: SEPAY_CONFIG.TEMPLATE,
      amount: order.totalAmount,
      des: transferContent
    }).toString();

    // Alternative: Dùng VietQR trực tiếp
    const vietQRUrl = `https://img.vietqr.io/image/${SEPAY_CONFIG.BANK_ID}-${SEPAY_CONFIG.ACCOUNT_NO}-${SEPAY_CONFIG.TEMPLATE}.png?` + new URLSearchParams({
      amount: order.totalAmount,
      addInfo: transferContent,
      accountName: SEPAY_CONFIG.ACCOUNT_NAME
    }).toString();

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus
      },
      payment: {
        bankId: SEPAY_CONFIG.BANK_ID,
        accountNo: SEPAY_CONFIG.ACCOUNT_NO,
        accountName: SEPAY_CONFIG.ACCOUNT_NAME,
        amount: order.totalAmount,
        content: transferContent,
        qrUrl: qrUrl,
        vietQRUrl: vietQRUrl
      }
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ message: 'Lỗi tạo mã QR' });
  }
});

// ============================================
// SEPAY WEBHOOK - Nhận thông báo biến động số dư
// ============================================
// POST /api/payment/sepay-webhook
// SePay sẽ gọi endpoint này khi có tiền vào tài khoản
router.post('/sepay-webhook', async (req, res) => {
  try {
    console.log('📥 SePay Webhook received:', JSON.stringify(req.body, null, 2));

    // Verify webhook từ SePay (kiểm tra API key trong header)
    const apiKey = req.headers['authorization'];
    if (apiKey !== `Apikey ${SEPAY_CONFIG.API_KEY}`) {
      console.log('❌ Invalid API Key');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      id,                    // ID giao dịch SePay
      gateway,               // Cổng thanh toán (bank code)
      transactionDate,       // Ngày giao dịch
      accountNumber,         // Số tài khoản nhận
      code,                  // Mã code (null hoặc mã tham chiếu)
      content,               // Nội dung chuyển khoản
      transferType,          // Loại: in (tiền vào) / out (tiền ra)
      transferAmount,        // Số tiền
      accumulated,           // Số dư tích lũy
      subAccount,            // Tài khoản phụ
      referenceCode,         // Mã tham chiếu ngân hàng
      description            // Mô tả đầy đủ
    } = req.body;

    // Chỉ xử lý tiền VÀO
    if (transferType !== 'in') {
      console.log('⏭️ Skipping outgoing transaction');
      return res.json({ success: true, message: 'Ignored outgoing transaction' });
    }

    // Parse order number từ nội dung chuyển khoản
    // Tìm pattern "DH" + số (ví dụ: DH1735654321000)
    const orderMatch = content.match(/DH(\d+)/i);
    
    if (!orderMatch) {
      console.log('⚠️ No order number found in content:', content);
      return res.json({ success: true, message: 'No order number in content' });
    }

    const orderNumber = orderMatch[1];
    console.log(`🔍 Looking for order: ${orderNumber}`);

    // Tìm đơn hàng theo orderNumber
    const order = await Order.findOne({ orderNumber: orderNumber });

    if (!order) {
      console.log(`❌ Order not found: ${orderNumber}`);
      return res.json({ success: false, message: 'Order not found' });
    }

    // Kiểm tra số tiền (cho phép sai số 1000đ để tránh lỗi làm tròn)
    const expectedAmount = order.totalAmount;
    const receivedAmount = parseFloat(transferAmount);
    
    if (Math.abs(receivedAmount - expectedAmount) > 1000) {
      console.log(`⚠️ Amount mismatch: expected ${expectedAmount}, received ${receivedAmount}`);
      // Vẫn cập nhật nhưng ghi chú
      order.paymentNote = `Số tiền không khớp: Cần ${expectedAmount}, nhận ${receivedAmount}`;
    }

    // Cập nhật trạng thái đơn hàng
    order.paymentStatus = 'completed';
    order.status = 'confirmed';
    order.paidAt = new Date(transactionDate);
    order.paymentDetails = {
      method: 'bank_transfer',
      gateway: gateway,
      transactionId: id,
      referenceCode: referenceCode,
      amount: receivedAmount,
      content: content,
      paidAt: new Date(transactionDate)
    };

    await order.save();

    console.log(`✅ Order ${orderNumber} marked as PAID!`);

    // Trả về success cho SePay
    res.json({
      success: true,
      message: 'Payment confirmed',
      orderId: order._id,
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// CHECK PAYMENT STATUS (Polling từ Frontend)
// ============================================
// GET /api/payment/status/:orderId
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .select('orderNumber status paymentStatus totalAmount paidAt paymentDetails');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        paidAt: order.paidAt,
        isPaid: order.paymentStatus === 'completed'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// SIMULATE PAYMENT (For Testing Only)
// ============================================
// POST /api/payment/simulate/:orderId
router.post('/simulate/:orderId', async (req, res) => {
  // Cho phép simulate trong demo - Bỏ check production
  // if (process.env.NODE_ENV === 'production') {
  //   return res.status(403).json({ message: 'Not allowed in production' });
  // }

  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Simulate payment
    order.paymentStatus = 'completed';
    order.status = 'confirmed';
    order.paidAt = new Date();
    order.paymentDetails = {
      method: 'bank_transfer',
      gateway: 'SIMULATE',
      transactionId: `SIM_${Date.now()}`,
      amount: order.totalAmount,
      paidAt: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: 'Payment simulated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
