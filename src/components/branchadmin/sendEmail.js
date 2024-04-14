const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Initialize Nodemailer with your SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Your SMTP server host
  port: 587, // Your SMTP server port (typically 587 for TLS)
  secure: false, // Set to true if your SMTP server requires secure connection (TLS)
  auth: {
    user: 'nikhita111999@gmail.com', // Your email address
    pass: 'Kurdikeri19?' // Your email password or app-specific password
  }
});

// HTTP Cloud Function to handle sending emails
exports.sendEmail = functions.https.onRequest((req, res) => {
  const { email, userId } = req.body;

  // Email sending logic
  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: 'Welcome to our platform',
    text: `Dear user, Welcome to our platform! Your user ID is: ${userId}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ success: false, error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send({ success: true });
    }
  });
});
