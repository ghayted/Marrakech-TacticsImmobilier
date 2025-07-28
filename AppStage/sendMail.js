const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configure le transporteur Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dafalighayt@gmail.com', // Ton adresse Gmail
    pass: 'jipt whjn nuvx nzxn' // Un mot de passe d'application Gmail (pas ton mot de passe normal)
  }
});

app.post('/api/contact', async (req, res) => {
  const { nom, prenom, email, tel, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'dafalighayt@gmail.com',
    subject: `Nouveau message de ${prenom} ${nom} via le site`,
    text: `Nom: ${nom}\nPrénom: ${prenom}\nEmail: ${email}\nTéléphone: ${tel}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message envoyé !' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi', error });
  }
});

app.listen(5000, () => {
  console.log('Serveur mail démarré sur http://localhost:5000');
}); 