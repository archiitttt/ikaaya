const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send order confirmation email to the business owner
 * @param {Object} order - The order document
 * @param {Object} customer - The customer user document
 */
const sendOrderEmail = async (order, customer) => {
  const itemRows = order.items.map(item =>
    `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ec4899, #f472b6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🛍️ New Order Received!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Order #${order._id}</p>
      </div>

      <div style="padding: 32px;">
        
        <!-- Customer Info -->
        <div style="background: #fdf2f8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 12px; color: #333; font-size: 16px;">👤 Customer Details</h2>
          <p style="margin: 4px 0; color: #555;"><strong>Name:</strong> ${customer.name}</p>
          <p style="margin: 4px 0; color: #555;"><strong>Email:</strong> ${customer.email}</p>
          <p style="margin: 4px 0; color: #555;"><strong>Phone:</strong> ${customer.phone}</p>
        </div>

        <!-- Shipping Address -->
        <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 12px; color: #333; font-size: 16px;">📦 Shipping Address</h2>
          <p style="margin: 4px 0; color: #555;"><strong>${order.address.fullName}</strong></p>
          <p style="margin: 4px 0; color: #555;">${order.address.house}</p>
          <p style="margin: 4px 0; color: #555;">${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
          <p style="margin: 4px 0; color: #555;">📞 ${order.address.phone}</p>
        </div>

        <!-- Order Items -->
        <h2 style="margin: 0 0 12px; color: #333; font-size: 16px;">🧾 Order Items</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 12px; text-align: left; font-size: 13px; color: #666; border-bottom: 2px solid #eee;">Product</th>
              <th style="padding: 12px; text-align: center; font-size: 13px; color: #666; border-bottom: 2px solid #eee;">Qty</th>
              <th style="padding: 12px; text-align: right; font-size: 13px; color: #666; border-bottom: 2px solid #eee;">Price</th>
              <th style="padding: 12px; text-align: right; font-size: 13px; color: #666; border-bottom: 2px solid #eee;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- Total -->
        <div style="background: #333; color: white; border-radius: 8px; padding: 20px; text-align: right;">
          <p style="margin: 4px 0; font-size: 14px;">Payment Method: <strong>${order.paymentMethod}</strong></p>
          <p style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">Total: ₹${order.totalAmount.toFixed(2)}</p>
        </div>

        <!-- Footer Note -->
        <div style="margin-top: 24px; padding: 16px; border: 1px dashed #ec4899; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 13px;">
            ⏰ Order placed on ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"ikaaya Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.ORDER_EMAIL || 'architkaushal2004@gmail.com',
    subject: `🛍️ New Order #${order._id.toString().slice(-8).toUpperCase()} - ₹${order.totalAmount.toFixed(2)}`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order email sent for order ${order._id}`);
  } catch (error) {
    console.error('Failed to send order email:', error);
    // Don't throw — order was already created, email failure shouldn't break the flow
  }
};

/**
 * Send order confirmation to the customer
 */
const sendCustomerConfirmationEmail = async (order, customer) => {
  const itemsList = order.items.map(item =>
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <div style="background: linear-gradient(135deg, #ec4899, #f472b6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Thank you for your order! 🎉</h1>
      </div>

      <div style="padding: 32px;">
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Hi <strong>${customer.name}</strong>,
        </p>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          We've received your order and it's being processed. Right now, we only accept orders via email and <strong>we will reach back to you regarding payments</strong>.
        </p>

        <!-- Order Summary -->
        <div style="background: #fdf2f8; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="margin: 0 0 16px; color: #333; font-size: 16px;">Your Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 10px; text-align: left; font-size: 13px; color: #666; border-bottom: 2px solid #f3e8ff;">Item</th>
                <th style="padding: 10px; text-align: center; font-size: 13px; color: #666; border-bottom: 2px solid #f3e8ff;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 13px; color: #666; border-bottom: 2px solid #f3e8ff;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #f3e8ff; text-align: right;">
            <span style="font-size: 18px; font-weight: 700; color: #ec4899;">Total: ₹${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <!-- Shipping -->
        <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 8px; color: #333; font-size: 16px;">📦 Shipping To</h2>
          <p style="margin: 4px 0; color: #555;">${order.address.fullName}, ${order.address.house}</p>
          <p style="margin: 4px 0; color: #555;">${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
        </div>

        <div style="text-align: center; padding: 20px; border: 1px dashed #ec4899; border-radius: 8px;">
          <p style="margin: 0; color: #ec4899; font-weight: 600; font-size: 14px;">
            📧 We will contact you shortly regarding payment details.
          </p>
          <p style="margin: 8px 0 0; color: #999; font-size: 12px;">
            If you have any questions, reply to this email or contact us.
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"ikaaya" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: `Order Confirmed! 🎉 We'll reach out regarding payment`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${customer.email}`);
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
  }
};

/**
 * Send OTP for email verification
 */
const sendOTPEmail = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #ec4899, #f472b6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
      </div>
      <div style="padding: 32px; text-align: center;">
        <p style="color: #555; font-size: 16px; margin-bottom: 24px;">
          Welcome to ikaaya! Please use the following One-Time Password (OTP) to complete your registration.
        </p>
        <div style="background: #fdf2f8; border-radius: 12px; padding: 24px; display: inline-block; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #ec4899; font-size: 36px; letter-spacing: 4px;">${otp}</h2>
        </div>
        <p style="color: #777; font-size: 14px;">
          This code will expire in 10 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"ikaaya" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your ikaaya Verification Code: ${otp}`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = { sendOrderEmail, sendCustomerConfirmationEmail, sendOTPEmail };
