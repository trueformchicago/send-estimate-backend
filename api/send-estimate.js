import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, message, attachment } = req.body;

  if (!to || !subject || !message || !attachment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'trueformchicago@gmail.com',
        pass: 'tlvcqanekatkorvu'
      },
    });

    const mailOptions = {
      from: 'TRUEFORM Chicago <trueformchicago@gmail.com>',
      to,
      subject,
      text: message,
      attachments: [
        {
          filename: 'estimate.pdf',
          content: Buffer.from(attachment, 'base64'),
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Email sending failed' });
  }
}
