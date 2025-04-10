import { NewCRMUserInfo } from '@/interfaces/crm';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/betterauth/auth';
import { OrganizationMetadata } from '@/interfaces/organization';
import { validateEmail } from '@/utils/emails';
import { validatePhone } from '@/utils/phone';
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

const isValidCompanyName = (name: string) => {
  const regex = /^[A-Za-z0-9&.,'’\-\s]{2,100}$/;
  return regex.test(name.trim());
};

const isValidName = (name: string) => {
  const regex = /^[\p{Script=Arabic}\p{Script=Latin}0-9\s'’.-]{2,100}$/u;
  return regex.test(name.trim());
};

async function createNewCRM(input: NewCRMUserInfo) {
  console.log('Starting createNewCRM with input:', JSON.stringify(input, null, 2));

  // Step 1: Validate user input
  await validateUserInput(input);

  // Step 2: Determine organization name
  const { orgName, name } = determineOrganizationName(input);

  // Step 3: Create user
  const { user, token, headers: signUpHeaders } = await createUser(input, name);

  // Step 4: Generate slug
  const proposedSlug = generateSlug(orgName);

  // Step 5: Check slug availability
  const slugAvailable = await checkSlugAvailability(proposedSlug);

  if (!slugAvailable) {
    console.log('Slug not available, deleting user and throwing error');
    // Delete the user
    await deleteUser(token, input.password);
    throw new TRPCError({
      code: 'BAD_REQUEST',
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
    metadata,
    token
  );

  // Step 8: Format and return result
  return formatResult(organization, proposedSlug, user.id, signUpHeaders, orgHeaders);
}

export { createNewCRM };
