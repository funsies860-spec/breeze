export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, address, city, zip, itemsText, subtotal, shippingCost, grandTotal } = req.body;

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  let telegramMsg = `🛍️ *NEW CHECKOUT ORDER*\n\n`;
  telegramMsg += `👤 *Customer:* ${name}\n`;
  telegramMsg += `📧 *Email:* ${email}\n`;
  telegramMsg += `📞 *Phone:* ${phone}\n`;
  telegramMsg += `📍 *Address:* ${address}, ${city} ${zip}\n\n`;
  telegramMsg += `*Items Ordered:*\n${itemsText}\n`;
  telegramMsg += `*Subtotal:* $${subtotal}\n`;
  telegramMsg += `*Shipping:* $${shippingCost}\n`;
  telegramMsg += `*Grand Total:* $${grandTotal}`;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: telegramMsg, parse_mode: 'Markdown' })
    });

    if (!telegramRes.ok) throw new Error('Telegram send failed');

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
