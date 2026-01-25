// Email Service - Simplified version for demo
// To enable real emails, configure Gmail credentials in .env

// Mock transporter for demo mode
const transporter = {
    sendMail: async (options) => {
        console.log('📧 Email would be sent to:', options.to);
        console.log('📧 Subject:', options.subject);
        console.log('📧 (Email sending disabled - configure EMAIL_USER and EMAIL_PASSWORD in .env to enable)');
        return { messageId: 'demo-' + Date.now() };
    }
};

// If email credentials are configured, use real nodemailer
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_USER !== 'your-email@gmail.com') {
    try {
        const nodemailer = require('nodemailer');
        const realTransporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        Object.assign(transporter, realTransporter);
        console.log('✅ Email service configured with Gmail');
    } catch (error) {
        console.warn('⚠️  Nodemailer not available, using demo mode');
    }
}

// Send welcome email for newsletter
async function sendWelcomeEmail(email) {
    const mailOptions = {
        from: `Boukilibre <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Bienvenue dans la communauté Boukilibre ! 🎉',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d3748; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #1a2f5a 0%, #2d4a7c 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
                    .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #1a2f5a 0%, #2d4a7c 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Bienvenue chez Boukilibre !</h1>
                    </div>
                    <div class="content">
                        <p>Bonjour,</p>
                        <p>Merci de vous être inscrit à notre newsletter ! Nous sommes ravis de vous compter parmi notre communauté.</p>
                        <p>En tant qu'abonné, vous recevrez :</p>
                        <ul>
                            <li>✨ Des conseils exclusifs pour votre développement</li>
                            <li>🎁 Des offres spéciales et réductions</li>
                            <li>📚 Les nouveautés en avant-première</li>
                            <li>💡 Des contenus gratuits de qualité</li>
                        </ul>
                        <p style="text-align: center;">
                            <a href="${process.env.SITE_URL || 'http://localhost:3000'}/catalog.html" class="button">Découvrir nos Ebooks</a>
                        </p>
                        <p>À très bientôt,<br><strong>L'équipe Boukilibre</strong></p>
                    </div>
                    <div class="footer">
                        <p>Vous recevez cet email car vous vous êtes inscrit à notre newsletter.</p>
                        <p>&copy; 2026 Boukilibre. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    return transporter.sendMail(mailOptions);
}

// Send order confirmation and delivery email
async function sendOrderConfirmationEmail(order, downloadLinks) {
    const ebooksList = order.items.map(item => `
        <li style="margin-bottom: 15px;">
            <strong>${item.title}</strong><br>
            <a href="${downloadLinks.find(link => link.ebookId.toString() === item.ebookId.toString())?.url}" 
               style="color: #1a2f5a; text-decoration: underline;">
                📥 Télécharger maintenant
            </a>
        </li>
    `).join('');

    const mailOptions = {
        from: `Boukilibre <${process.env.EMAIL_USER}>`,
        to: order.customerEmail,
        subject: `Votre commande Boukilibre - ${order.orderNumber} ✅`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d3748; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #1a2f5a 0%, #2d4a7c 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
                    .order-details { background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-radius: 0 0 10px 10px; }
                    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Commande Confirmée !</h1>
                    </div>
                    <div class="content">
                        <p>Bonjour${order.customerName ? ' ' + order.customerName : ''},</p>
                        <p>Merci pour votre commande ! Votre paiement a été confirmé et vos ebooks sont prêts à être téléchargés.</p>
                        
                        <div class="order-details">
                            <h3>Détails de la commande</h3>
                            <p><strong>Numéro de commande :</strong> ${order.orderNumber}</p>
                            <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                            <p><strong>Montant total :</strong> ${order.totalAmount.toLocaleString()} FCFA</p>
                        </div>
                        
                        <h3>Vos Ebooks :</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${ebooksList}
                        </ul>
                        
                        <div class="alert">
                            <strong>⚠️ Important :</strong> Les liens de téléchargement sont valables pendant 30 jours. Nous vous recommandons de sauvegarder vos ebooks immédiatement.
                        </div>
                        
                        <p>Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:support@boukilibre.com">support@boukilibre.com</a></p>
                        
                        <p>Bonne lecture et bonne transformation !<br><strong>L'équipe Boukilibre</strong></p>
                    </div>
                    <div class="footer">
                        <p>Numéro de commande : ${order.orderNumber}</p>
                        <p>&copy; 2026 Boukilibre. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    return transporter.sendMail(mailOptions);
}

// Send contact form email
async function sendContactEmail(name, email, message) {
    const mailOptions = {
        from: `Boukilibre <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Nouveau message de contact - ${name}`,
        html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Message :</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    return transporter.sendMail(mailOptions);
}

// Send contact confirmation to user
async function sendContactConfirmation(name, email) {
    const mailOptions = {
        from: `Boukilibre <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Nous avons bien reçu votre message',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d3748; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #1a2f5a 0%, #2d4a7c 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
                    .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Message bien reçu !</h1>
                    </div>
                    <div class="content">
                        <p>Bonjour ${name},</p>
                        <p>Merci de nous avoir contactés. Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais (généralement sous 24 heures).</p>
                        <p>Notre équipe examine votre demande avec attention.</p>
                        <p>À très bientôt,<br><strong>L'équipe Boukilibre</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Boukilibre. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendContactEmail,
    sendContactConfirmation
};
