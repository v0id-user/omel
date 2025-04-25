import { task } from '@trigger.dev/sdk/v3';

export const emailSend = task({
  id: 'email-send',
  // email recpient and template type use enum (welcome, resetPassword, verifyEmail)
  run: async (payload: { email: string; template: string }) => {
    console.log(payload);
  },
});
