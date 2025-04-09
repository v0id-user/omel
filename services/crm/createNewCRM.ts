import { NewCRMUserInfo } from '@/interfaces/crm';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/betterauth/auth';

const isValidCompanyName = (name: string) => {
  const regex = /^[A-Za-z0-9&.,'’\-\s]{2,100}$/;
  return regex.test(name.trim());
};

const isValidName = (name: string) => {
  const regex = /^[\p{Script=Arabic}\p{Script=Latin}0-9\s'’.-]{2,100}$/u;
  return regex.test(name.trim());
};

async function createNewCRM(input: NewCRMUserInfo) {
  // TODO: Create the new data all in the database
  // TODO:      work on the database schema now...
  // TODO:      validate all data second time to make sure the data is correct

  var orgName: string;
  var name: string = input.personalInfo.firstName + ' ' + input.personalInfo.lastName;
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
  const user = await auth.api.signUpEmail({
    body: {
      email: input.email,
      password: input.password,
      name: name,
    },
  });

  // Create the organization
  const org = await auth.api.createOrganization({
    body: {
      name: orgName,
      slug: orgName.toLowerCase().replace(/ /g, '-'),
      metadata: {
        createdBy: user.user.id,
      },
    },
  });

  if (!org) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create organization',
    });
  }

  // Add the user as an admin to the organization
  const userAsAdmin = await auth.api.addMember({
    body: {
      userId: user.user.id,
      role: 'admin',
      organizationId: org.id,
    },
  });

  if (!userAsAdmin) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to add user as admin to organization',
    });
  }

  // TODO: return a good response and process in the UI
}

export { createNewCRM };
