const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });
  
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  exports.sendEmail = (req, res) => {
    const emailLines = [
      'To: your-email@example.com',
      'Subject: Contact Form Submission',
      '',
      `Name: ${req.body.name}`,
      `Email: ${req.body.email}`,
      `Message: ${req.body.message}`
    ];
  
    const email = emailLines.join('\n');
    const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  
    gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64EncodedEmail
      }
    }, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error sending email');
      } else {
        res.status(200).send('Email sent');
      }
    });
  };