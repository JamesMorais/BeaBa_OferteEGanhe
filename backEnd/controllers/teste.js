// const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE ,
//     auth: {
//       user: process.env.EMAIL_USER , // Substitua pelo seu e-mail
//       pass: process.env.EMAIL_PASSWORD // Substitua pela senha de aplicativo (não a senha normal)
//     }
//   });
  
//   // Definição do e-mail
//   const mailOptions = {
//     from: process.env.EMAIL_USER , // Remetente
//     to: email, // Destinatário(s)
//     subject: 'Teste de envio de e-mail com Node.js', // Assunto
//     text: 'Olá! Este é um e-mail enviado usando o Node.js e o Nodemailer!' // Conteúdo em texto
//     // Se quiser enviar em HTML, use a propriedade `html`:
//     // html: '<h1>Olá!</h1><p>Este é um e-mail enviado usando o Node.js e o Nodemailer!</p>'
//   };
  
//   // Enviar o e-mail
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log('Erro ao enviar e-mail:', error);
//     }
//     console.log('E-mail enviado com sucesso! ID:', info.messageId);
//   });