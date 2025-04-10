import { NewCRMUserInfo } from '@/interfaces/crm';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/betterauth/auth';
import { OrganizationMetadata } from '@/interfaces/organization';
import { validateEmail } from '@/utils/emails';
import { validatePhone } from '@/utils/phone';
import { phoneNumber } from 'better-auth/plugins';

const isValidCompanyName = (name: string) => {
  const regex = /^[A-Za-z0-9&.,'’\-\s]{2,100}$/;
  return regex.test(name.trim());
};

const isValidName = (name: string) => {
  const regex = /^[\p{Script=Arabic}\p{Script=Latin}0-9\s'’.-]{2,100}$/u;
  return regex.test(name.trim());
};

async function createNewCRM(input: NewCRMUserInfo) {
  var orgName: string;
  var name: string = input.personalInfo.firstName + ' ' + input.personalInfo.lastName;

  // Validate the email
  if (!(await validateEmail(input.email))) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid email',
    });
  }

  // Validate the email
  if (!(await validatePhone(input.personalInfo.phone))) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid phone',
    });
  }

  if (input.companyInfo.name) {
    if (!isValidCompanyName(input.companyInfo.name)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid company name',
      });
    }

    orgName = input.companyInfo.name;
  } else {
    if (!isValidName(name)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid name',
      });
    }

    orgName = name;
  }

  // Create the user
  const signUpResponse = await auth.api.signUpEmail({
    body: {
      email: input.email,
      password: input.password,
      name: name,
      phoneNumber: input.personalInfo.phone,
    },
    asResponse: true,
  });

  if (!signUpResponse.ok) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create user',
    });
  }

  const user = await signUpResponse.json();

  const proposedSlug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Check if the slug is available
  const slugAvailable = await auth.api.checkOrganizationSlug({
    body: {
      slug: proposedSlug,
    },
  });

  if (!slugAvailable) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Organization name already taken',
    });
  }

  // Typing the metadata
  const metadata: OrganizationMetadata = {
    createdBy: user.id,
    createdAt: new Date().toISOString(),
    type: input.companyInfo.name ? 'company' : 'individual',
    size: input.companyInfo.size ?? '1-10',
    companyWebsite: input.companyInfo.website ?? '',
    companyAddress: input.companyInfo.address ?? '',
  };

  // Create the organization
  const orgResponse = await auth.api.createOrganization({
    body: {
      name: orgName,
      slug: proposedSlug,
      metadata,
    },
    asResponse: true,
  });

  if (!orgResponse.ok) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create organization',
    });
  }

  const org = await orgResponse.json();

  // TODO: We assume now that the user will be assigned as an "owner" to the organization
  //       if not add this explicitly
  //=====================================================================================//
  // // Add the user as an admin to the organization
  // const userAsAdmin = await auth.api.addMember({
  //   body: {
  //     userId: user.user.id,
  //     role: 'owner',
  //     organizationId: org.id,
  //   },
  // });

  // if (!userAsAdmin) {
  //   throw new TRPCError({
  //     code: 'INTERNAL_SERVER_ERROR',
  //     message: 'Failed to add user as admin to organization',
  //   });
  // }

  // TODO: return a good response and process in the UI, make sure the cookies reach the client
  return {
    data: {
      organizationId: org.id,
      userId: user.id,
    },
    cookies: [...signUpResponse.headers.getSetCookie(), ...orgResponse.headers.getSetCookie()],
    headers: {
      ...Object.fromEntries(signUpResponse.headers.entries()),
      ...Object.fromEntries(orgResponse.headers.entries()),
    },
  };
}

export { createNewCRM };
