import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, message, attachment } = req.body;

  if (!to || !attachment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `TRUEFORM CHICAGO <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || 'Your Estimate from TrueForm Chicago',
      text: message || 'Attached is your TrueForm estimate. Let us know if you have any questions.',
      attachments: [
        {
          filename: 'estimate.pdf',
          content: Buffer.from(attachment, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Email failed to send' });
  }
}
