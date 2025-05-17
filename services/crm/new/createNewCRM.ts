import { NewCRMUserInfo } from '@/interfaces/crm';
import { TRPCError } from '@trpc/server';
import {
  validateUserInput,
  determineOrganizationName,
  createUser,
  generateSlug,
  checkSlugAvailability,
  deleteUser,
  createOrganizationMetadata,
  createOrganization,
  formatResult,
} from './steps';

import { EmailTemplate, sendEmail } from '@/trigger/sendEmail';

async function createNewCRM(input: NewCRMUserInfo) {
  console.log('Starting createNewCRM with input:', JSON.stringify(input, null, 2));

  try {
    // Step 1: Validate user input
    await validateUserInput(input);

    // Step 2: Determine organization name
    const { orgName, name } = determineOrganizationName(input);

    // Step 3: Create user
    const { user, token, headers: signUpHeaders } = await createUser(input, name);

    try {
      // Step 4: Generate slug
      const proposedSlug = generateSlug(orgName);

      // Step 5: Check slug availability
      const slugAvailable = await checkSlugAvailability(proposedSlug);

      if (!slugAvailable) {
        console.log('Slug not available, deleting user and throwing error');
        // Delete the user
        await deleteUser(token, input.password);
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Organization name already taken',
        });
      }
      console.log('Slug is available');

      // Step 6: Create organization metadata
      const metadata = createOrganizationMetadata(input, user.id);

      // Step 7: Create organization
      const { organization, headers: orgHeaders } = await createOrganization(
        orgName,
        user.id,
        proposedSlug,
        metadata
      );

      // Step 8: Format and return result
      const formattedResult = formatResult(
        organization,
        proposedSlug,
        user.id,
        orgHeaders,
        signUpHeaders
      );

      // Step 9: Send welcome email with trigger.dev
      await sendEmail.trigger({
        email: user.email,
        template: EmailTemplate.WELCOME,
      });

      return formattedResult;
    } catch (error) {
      console.error('Error after user creation, cleaning up:', error);
      try {
        await deleteUser(token, input.password);
      } catch (cleanupError) {
        console.error('Failed to clean up user after error:', cleanupError);
      }
      throw error; // Re-throw the original error
    }
  } catch (error) {
    console.error('Error in createNewCRM:', error);

    if (!(error instanceof TRPCError)) {
      if (error instanceof Error) {
        const message = error.message;

        if (message.includes('already exists') || message.includes('already taken')) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: message,
          });
        }

        if (message.includes('validation') || message.includes('invalid')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: message || 'فشل في إنشاء حساب جديد',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'فشل في إنشاء حساب جديد',
      });
    }

    throw error;
  }
}

export { createNewCRM };
