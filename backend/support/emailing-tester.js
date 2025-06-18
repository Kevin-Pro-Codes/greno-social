const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../users');
const transporter = require('../mailer'); // ← required!
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);

  // Test email sending on server start
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'ferreira.kevin94@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email',
  }, (err, info) => {
    if (err) {
      console.error('Email error:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
});
