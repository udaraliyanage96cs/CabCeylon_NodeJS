require('dotenv').config();

const cors = require('cors');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME, 
    pass: process.env.MAIL_PASSWORD,
  },
});

app.post('/send-email', (req, res) => {
  const { to, html , key } = req.body;

  if (!to || !html || !key) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let mailOptions = {
    from: `"CabCeylon" <${process.env.MAIL_FROM_ADDRESS}>`, 
    to: [to,'cabceylon02@gmail.com'], 
    subject: 'CabCeylon Vehicle Booking',
    html: html,
  };

  if(key == process.env.KEY){
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(500).send('Failed to send email');
          } else {
            console.log('Message sent: %s', info.messageId);
            return res.send('Email sent successfully');
          }
      });
  }else{
      return res.status(500).send('Invalid KEY');
  }
  
});

app.post('/send-contact-email', (req, res) => {
  const { to, emailHtmlClient , emailHtmlAdmin, submission, key } = req.body;

  if (!to || !emailHtmlClient || !emailHtmlAdmin ||  !submission || !key) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let mailOptions = {
    from: `"CabCeylon" <${process.env.MAIL_FROM_ADDRESS}>`, 
    to: [to], 
    subject: 'Contact Form Submission',
    html: emailHtmlClient,
  };

  let mailOptionAdmin = {
    from: `"CabCeylon" <${process.env.MAIL_FROM_ADDRESS}>`, 
    to: ['cabceylon02@gmail.com'], 
    subject: 'Contact Form Submission',
    html: emailHtmlAdmin,
  };

  if(key == process.env.KEY){
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return res.status(500).send('Failed to send email');
          } else {
            console.log('Message sent: %s', info.messageId);
            return res.send('Email sent successfully');
          }
      });

      transporter.sendMail(mailOptionAdmin, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send('Failed to send email');
        } else {
          console.log('Message sent: %s', info.messageId);
          return res.send('Email sent successfully');
        }
    });

  }else{
      return res.status(500).send('Invalid KEY');
  }
  
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
