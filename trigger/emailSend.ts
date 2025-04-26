import { task, logger } from '@trigger.dev/sdk/v3';
import { sendWelcomeEmail } from '@/utils/emails/sendEmail';

export enum EmailTemplate {
  WELCOME = 'welcome',
}

export const emailSend = task({
  id: 'email-send',
  run: async (payload: { email: string; template: EmailTemplate }) => {
    try {
      logger.info('Processing email request', {
        template: payload.template,
        to: payload.email,
      });

      switch (payload.template) {
        case EmailTemplate.WELCOME:
          const result = await sendWelcomeEmail(payload.email);
          return { success: true, result };
        default:
          throw new Error(`Email template "${payload.template}" not supported`);
      }
    } catch (error: any) {
      logger.error('Failed to send email', { error });
      return { success: false, error: error.message || String(error) };
    }
  },
});
