import nodemailer from 'nodemailer';

// Configure email transporter (using environment variables)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

/**
 * Send order confirmation email to customer
 * @param {string} recipientEmail - Customer email address
 * @param {object} order - Order data
 * @param {string} customerName - Customer name (if provided)
 */
export const sendOrderConfirmationEmail = async (recipientEmail, order, customerName = 'Khách hàng') => {
  try {
    // Format items list
    const itemsList = order.items
      .map((item) => {
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        const total = quantity * price;
        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">
              ${item.name || 'Sản phẩm'} (x${quantity})
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">
              $${price.toFixed(2)}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">
              $${total.toFixed(2)}
            </td>
          </tr>
        `;
      })
      .join('');

    const totalAmount = order.totalAmount || 0;
    const shippingAddress = order.shippingAddress || {};

    // Create HTML email template
    const emailHTML = `
      <!DOCTYPE html>
      <html style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 8px 0 0 0;
              opacity: 0.9;
              font-size: 14px;
            }
            .content {
              padding: 30px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              font-size: 16px;
              font-weight: 600;
              color: #333;
              margin: 0 0 15px 0;
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
            }
            .order-info {
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 15px;
              font-size: 14px;
            }
            .order-info-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
            }
            .order-info-label {
              color: #666;
              font-weight: 500;
            }
            .order-info-value {
              color: #333;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            th {
              background: #f0f0f0;
              padding: 10px 8px;
              text-align: left;
              font-size: 13px;
              font-weight: 600;
              color: #333;
              border-bottom: 2px solid #e0e0e0;
            }
            td {
              padding: 8px;
              font-size: 14px;
              color: #555;
            }
            .total-row {
              background: #f9fafb;
              font-weight: 600;
              color: #333;
            }
            .address-box {
              background: #f0f8ff;
              border-left: 4px solid #667eea;
              padding: 15px;
              border-radius: 4px;
              font-size: 14px;
            }
            .payment-method {
              background: #f0fef4;
              border-left: 4px solid #10b981;
              padding: 15px;
              border-radius: 4px;
              font-size: 14px;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #e0e0e0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 600;
              margin-top: 15px;
            }
            .note {
              background: #fffbeb;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              border-radius: 4px;
              font-size: 13px;
              color: #92400e;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Đơn Hàng Xác Nhận</h1>
              <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi</p>
            </div>

            <div class="content">
              <p>Xin chào <strong>${customerName}</strong>,</p>
              <p>Đơn hàng của bạn đã được tạo thành công! Dưới đây là chi tiết đơn hàng:</p>

              <!-- Order Info -->
              <div class="section">
                <h2>📋 Thông Tin Đơn Hàng</h2>
                <div class="order-info">
                  <div class="order-info-row">
                    <span class="order-info-label">Mã Đơn Hàng:</span>
                    <span class="order-info-value">#${order.orderNumber}</span>
                  </div>
                  <div class="order-info-row">
                    <span class="order-info-label">Ngày Đặt:</span>
                    <span class="order-info-value">${new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div class="order-info-row">
                    <span class="order-info-label">Trạng Thái:</span>
                    <span class="order-info-value">⏳ Đang Xử Lý</span>
                  </div>
                </div>
              </div>

              <!-- Items -->
              <div class="section">
                <h2>📦 Chi Tiết Sản Phẩm</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Sản Phẩm</th>
                      <th style="text-align: right;">Giá</th>
                      <th style="text-align: right;">Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                    <tr class="total-row">
                      <td colspan="2">Tổng Cộng:</td>
                      <td style="text-align: right;">$${totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Shipping Address -->
              ${shippingAddress.name ? `
              <div class="section">
                <h2>📍 Địa Chỉ Giao Hàng</h2>
                <div class="address-box">
                  <strong>${shippingAddress.name}</strong><br>
                  Số điện thoại: ${shippingAddress.phone}<br>
                  ${shippingAddress.address}, ${shippingAddress.city}<br>
                  ${shippingAddress.zipCode ? `Mã Zip: ${shippingAddress.zipCode}<br>` : ''}
                  Quốc gia: ${shippingAddress.country || 'Vietnam'}
                </div>
              </div>
              ` : ''}

              <!-- Payment Method -->
              ${order.paymentMethod ? `
              <div class="section">
                <h2>💳 Phương Thức Thanh Toán</h2>
                <div class="payment-method">
                  ${getPaymentMethodLabel(order.paymentMethod)}
                </div>
              </div>
              ` : ''}

              <!-- Important Note -->
              <div class="note">
                <strong>📌 Lưu Ý Quan Trọng:</strong><br>
                • Vui lòng kiểm tra email của bạn để nhận các cập nhật về đơn hàng<br>
                • Liên hệ chúng tôi nếu bạn có bất kỳ câu hỏi nào<br>
                • Giữ lại email xác nhận này để tham khảo
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" class="cta-button">
                  Xem Đơn Hàng của Tôi
                </a>
              </div>
            </div>

            <div class="footer">
              <p>© ${new Date().getFullYear()} Cửa Hàng Của Chúng Tôi. Mọi quyền được bảo lưu.</p>
              <p style="margin-top: 10px;">
                Nếu bạn không đặt đơn hàng này, vui lòng bỏ qua email này.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: `"Cửa Hàng Của Chúng Tôi" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Xác Nhận Đơn Hàng #${order.orderNumber}`,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Order confirmation email sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order email:', error);
    // Don't throw - allow order to complete even if email fails
    return false;
  }
};

/**
 * Send payment reminder email
 */
export const sendPaymentReminderEmail = async (recipientEmail, order) => {
  try {
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Nhắc Nhở Thanh Toán</h1>
            </div>
            <div class="content">
              <p>Đơn hàng #${order.orderNumber} của bạn đang chờ thanh toán.</p>
              <p>Tổng tiền: <strong>$${order.totalAmount.toFixed(2)}</strong></p>
              <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/${order._id}">Thanh toán ngay</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Cửa Hàng" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Nhắc Nhở Thanh Toán - Đơn Hàng #${order.orderNumber}`,
      html: emailHTML
    });

    return true;
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return false;
  }
};

/**
 * Send order status update email
 */
export const sendOrderStatusUpdateEmail = async (recipientEmail, order, oldStatus, newStatus) => {
  try {
    const statusLabels = {
      'pending': '⏳ Đang Chờ Xử Lý',
      'confirmed': '✅ Đã Xác Nhận',
      'shipped': '🚚 Đã Gửi Hàng',
      'delivered': '🎉 Đã Giao Hàng',
      'cancelled': '❌ Đã Hủy'
    };

    const statusMessages = {
      'confirmed': 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.',
      'shipped': 'Đơn hàng của bạn đã được gửi đi. Bạn sẽ nhận được hàng trong vài ngày tới.',
      'delivered': 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm!',
      'cancelled': 'Đơn hàng của bạn đã bị hủy. Nếu bạn có thắc mắc, vui lòng liên hệ chúng tôi.'
    };

    const emailHTML = `
      <!DOCTYPE html>
      <html style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .status-box { background: #f0f8ff; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .status-box h2 { margin: 0 0 10px 0; color: #333; font-size: 20px; }
            .order-info { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .order-info-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Cập Nhật Đơn Hàng</h1>
            </div>
            <div class="content">
              <p>Xin chào,</p>
              <p>Đơn hàng <strong>#${order.orderNumber}</strong> của bạn đã được cập nhật trạng thái:</p>
              
              <div class="status-box">
                <h2>${statusLabels[newStatus]}</h2>
                <p>${statusMessages[newStatus] || 'Trạng thái đơn hàng đã được cập nhật.'}</p>
              </div>

              <div class="order-info">
                <div class="order-info-row">
                  <span>Mã đơn hàng:</span>
                  <strong>#${order.orderNumber}</strong>
                </div>
                <div class="order-info-row">
                  <span>Tổng tiền:</span>
                  <strong>$${order.totalAmount.toFixed(2)}</strong>
                </div>
                <div class="order-info-row">
                  <span>Ngày cập nhật:</span>
                  <span>${new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="cta-button">
                  Xem Chi Tiết Đơn Hàng
                </a>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cửa Hàng Của Chúng Tôi</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Cửa Hàng" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Cập Nhật Đơn Hàng #${order.orderNumber} - ${statusLabels[newStatus]}`,
      html: emailHTML
    });

    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    return false;
  }
};

/**
 * Helper function to get payment method label
 */
function getPaymentMethodLabel(method) {
  const methods = {
    'qr_transfer': '🔐 Chuyển Khoản QR (MoMo / ZaloPay / VNPAY)',
    'cash_on_delivery': '🚚 Thanh Toán Khi Nhận Hàng (COD)',
    'bank_transfer': '🏦 Chuyển Khoản Ngân Hàng',
    'credit_card': '💳 Thẻ Tín Dụng / Ghi Nợ',
    'debit_card': '💳 Thẻ Ghi Nợ'
  };
  return methods[method] || method;
}

export default {
  sendOrderConfirmationEmail,
  sendPaymentReminderEmail,
  sendOrderStatusUpdateEmail
};
