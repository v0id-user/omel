import { Resend } from 'resend';
import WelcomeEmail from './templs/welcome';

async function sendWelcomeEmail(to: string, subject: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'Omel <hello@omel.im>',
    to: [to],
    subject: subject,
    react: WelcomeEmail(to),
  });
  if (error) {
    console.error(error);
    return false;
  }
  return data;
}

export { sendWelcomeEmail };
