import { Resend } from 'resend';
import WelcomeEmail from './templs/welcome';
import { logger } from '@trigger.dev/sdk/v3';
import { renderReactEmail } from './renderEmail';

async function sendWelcomeEmail(to: string) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    logger.info('Sending welcome email', { to });

    // Render the React component to HTML string
    const htmlContent = await renderReactEmail(<WelcomeEmail recipientEmail={to} />);

    const { data, error } = await resend.emails.send({
      from: 'Omel <hello@omel.im>',
      to: [to],
      subject: 'مرحبا بك في منصة أوميل',
      html: htmlContent,
    });

    if (error) {
      logger.error('Failed to send email', { error });
      throw new Error(`Failed to send email: ${error.message}`);
    }

    logger.info('Email sent successfully', { emailId: data?.id });

    return {
      id: data?.id,
      status: 'sent',
    };
  } catch (error) {
    logger.error('Unexpected error sending email', { error });
    throw error;
  }
}

export { sendWelcomeEmail };
