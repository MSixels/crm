/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});

admin.initializeApp();

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  const {email, name, password} = data;

  const msg = {
    to: email,
    from: "sistemaspccn@gmail.com",
    subject: "Bem-vindo à plataforma!",
    text: `Olá ${name}, sua conta foi criada com sucesso. Utilize o seguinte email e senha para acessar a plataforma:`,
    html: `
      <h1>Bem-vindo, ${name}!</h1>
      <p>Sua conta foi criada com sucesso. Abaixo estão seus dados de acesso:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Senha:</strong> ${password}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return {success: true, message: "Email enviado com sucesso!"};
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw new functions.https.HttpsError("internal", "Erro ao enviar email.");
  }
});
