import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

const nodeConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'arohatechnologies0@gmail.com', // Replace with your Gmail email
    pass: 'vcyoqyedkredetzn' // Replace with your Gmail password
  }
};

const transporter = nodemailer.createTransport(nodeConfig);

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Aroha Technologies', // Change the product name
    link: 'https://mailgen.js/'
  }
});

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {
  console.log('Data is comming in Register Mail: ', req.body)
  const { username, userEmail, text, subject } = req.body;

  const email = {
    body: {
      name: username,
      intro: text || 'User registered successfully', // Customize the email introduction
      outro: 'Need help or have questions? Just reply to this email.\n\nYours truly,\nAroha Technologies' // Customize the email signature
    }
  };

  const emailBody = mailGenerator.generate(email);

  const message = {
    from: 'arohatechnologies0@gmail.com', // Use the Aroha Technologies email address as the sender
    to: userEmail,
    subject: subject || 'Signed up successfully',
    html: emailBody
  };

  try {
    await transporter.sendMail(message);
    return res.status(200).send({ msg: 'You should receive an email from Aroha Technologies.' });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

export default transporter
