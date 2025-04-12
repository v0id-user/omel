import { NewCRMUserInfo } from '@/interfaces/crm';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/betterauth/auth';
import { OrganizationMetadata } from '@/interfaces/organization';
import { validateEmail } from '@/utils/emails';
import { validatePhone } from '@/utils/phone';
import { headers } from 'next/headers';

const isValidCompanyName = (name: string) => {
  const regex = /^[A-Za-z0-9&.,'’\-\s]{2,100}$/;
  return regex.test(name.trim());
};

const isValidName = (name: string) => {
  const regex = /^[\p{Script=Arabic}\p{Script=Latin}0-9\s'’.-]{2,100}$/u;
  return regex.test(name.trim());
};

export async function validateUserInput(input: NewCRMUserInfo) {
  console.log('Validating user input');

  // Validate the email
  console.log('Validating email:', input.email);
  if (!(await validateEmail(input.email))) {
    console.log('Email validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid email - validation failed',
    });
  }
  console.log('Email validation successful');

  // Validate the phone
  console.log('Validating phone:', input.personalInfo.phone);
  if (!(await validatePhone(input.personalInfo.phone))) {
    console.log('Phone validation failed');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid phone number - validation failed',
    });
  }
  console.log('Phone validation successful');

  // Validate the password
  console.log('Validating password length');
  if (input.password.length < 8) {
    console.log('Password validation failed - too short');
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Password must be at least 8 characters long',
    });
  }
  console.log('Password validation successful');

  return true;
}

export function determineOrganizationName(input: NewCRMUserInfo) {
  console.log('Determining organization name');

  const name: string = input.personalInfo.firstName + ' ' + input.personalInfo.lastName;
  console.log('Generated full name:', name);

  let orgName: string;

  if (input.companyInfo.name) {
    console.log('Validating company name:', input.companyInfo.name);
    if (!isValidCompanyName(input.companyInfo.name)) {
      console.log('Company name validation failed');
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid company name',
      });
    }
    console.log('Company name validation successful');
    orgName = input.companyInfo.name;
  } else {
    console.log('Validating individual name:', name);
    if (!isValidName(name)) {
      console.log('Individual name validation failed');
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid name',
      });
    }
    console.log('Individual name validation successful');
    orgName = name;
  }

  return { orgName, name };
}

export async function createUser(input: NewCRMUserInfo, name: string) {
  console.log('Attempting to create user with email:', input.email);
  try {
    let { response: signUpResponse, headers: signUpHeaders } = await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: name,
        phoneNumber: input.personalInfo.phone,
      },
      returnHeaders: true,
    });

    if (!signUpResponse.user || !signUpResponse.token) {
      console.log('User creation failed - no user or token returned');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user - missing user data',
      });
    }
    console.log('User created successfully');
    return {
      user: signUpResponse.user,
      token: signUpResponse.token,
      headers: signUpHeaders,
    };
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle API-specific errors from BetterAuth
    if (error instanceof Error) {
      const message = error.message;

      if (message.includes('already exists') || message.includes('already taken')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: message || 'Failed to create user',
      });
    }

    throw error;
  }
}

export function generateSlug(orgName: string) {
  const proposedSlug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  console.log('Generated proposed slug:', proposedSlug);

  return proposedSlug;
}

export async function checkSlugAvailability(proposedSlug: string) {
  console.log('Checking slug availability:', proposedSlug);
  const slugAvailable = await auth.api.checkOrganizationSlug({
    body: {
      slug: proposedSlug,
    },
  });

  console.log('Slug availability check result:', slugAvailable);
  return slugAvailable;
}

export async function deleteUser(token: string, password: string) {
  console.log('Deleting user with token');
  try {
    await auth.api.deleteUser({
      body: {
        password: password,
        ...(token && { token: token }),
      },
    });
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    // We don't throw here as this is used in cleanup,
    // and we want to continue even if deletion fails
  }
}

export function createOrganizationMetadata(input: NewCRMUserInfo, userId: string) {
  const metadata: OrganizationMetadata = {
    createdBy: userId,
    createdAt: new Date().toISOString(),
    type: input.companyInfo.name ? 'company' : 'individual',
    size: input.companyInfo.size ?? '1-10',
    companyWebsite: input.companyInfo.website ?? '',
    companyAddress: input.companyInfo.address ?? '',
  };
  console.log('Generated organization metadata:', metadata);

  return metadata;
}

export async function createOrganization(
  orgName: string,
  userId: string,
  proposedSlug: string,
  metadata: OrganizationMetadata
) {
  console.log('Attempting to create organization with name:', orgName);

  try {
    let { response: orgResponse, headers: orgHeaders } = await auth.api.createOrganization({
      body: {
        name: orgName,
        slug: proposedSlug,
        userId: userId,
        metadata,
      },
      returnHeaders: true,
    });

    if (!orgResponse) {
      console.log('Organization creation failed');
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create organization - no response',
      });
    }

    console.log('Organization created successfully:', orgResponse);

    return {
      organization: orgResponse,
      headers: orgHeaders,
    };
  } catch (error) {
    console.error('Error creating organization:', error);

    if (error instanceof Error) {
      const message = error.message;

      if (message.includes('already exists') || message.includes('already taken')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Organization with this name already exists',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: message || 'Failed to create organization',
      });
    }

    throw error;
  }
}

export function formatResult(
  org: any,
  proposedSlug: string,
  userId: string,
  orgHeaders: Headers,
  signUpHeaders: Headers
) {
  const result = {
    data: {
      organizationId: org.id,
      organizationSlug: proposedSlug,
      userId: userId,
      status: 'ok',
    },
    headers: {
      ...Object.fromEntries(signUpHeaders.entries()),
      ...Object.fromEntries(orgHeaders.entries()),
    },
  };
  console.log('Returning final result:', result);
  console.log('Organization headers:', orgHeaders);
  console.log('Sign up headers:', signUpHeaders);

  return result;
}
