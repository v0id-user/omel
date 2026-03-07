import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/betterauth/auth';
import { validateEmail } from '@/utils/emails';
import { validatePhoneArab } from '@/utils/phone';
import { sendEmail, EmailTemplate } from '@/trigger/sendEmail';
import { OrganizationMetadata } from '@/interfaces/organization';
import { NewCRMUserInfoInput } from '../contracts';
import { CRMCreationResult } from '../types';

const companyNamePattern = /^[\p{Script=Arabic}\p{Script=Latin}0-9&.,'’\-\s]{2,100}$/u;
const personNamePattern = /^[\p{Script=Arabic}\p{Script=Latin}0-9\s'’.-]{2,100}$/u;

function normalizeOptionalValue(value?: string) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function toHeadersObject(...headersList: Headers[]) {
  return headersList.reduce<Record<string, string>>((accumulator, headers) => {
    for (const [key, value] of headers.entries()) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
}

function toUnexpectedTRPCError(error: unknown, fallbackMessage: string): never {
  if (error instanceof TRPCError) {
    throw error;
  }

  if (error instanceof Error) {
    const errorMessage = error.message;

    if (errorMessage.includes('already exists') || errorMessage.includes('already taken')) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: errorMessage,
      });
    }

    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: errorMessage,
      });
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage || fallbackMessage,
    });
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: fallbackMessage,
  });
}

async function validateUserInput(input: NewCRMUserInfoInput) {
  if (!(await validateEmail(input.email))) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid email - validation failed',
    });
  }

  if (!validatePhoneArab(input.personalInfo.phone)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'رقم الهاتف غير صالح',
    });
  }

  if (input.password.length < 8) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'يجب أن يكون كلمة المرور على الأقل 8 أحرف',
    });
  }
}

function determineOrganizationName(input: NewCRMUserInfoInput) {
  const fullName = `${input.personalInfo.firstName} ${input.personalInfo.lastName}`.trim();
  const providedOrganizationName = normalizeOptionalValue(input.companyInfo.name);

  if (providedOrganizationName) {
    if (!companyNamePattern.test(providedOrganizationName)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'اسم الشركة غير صالح',
      });
    }

    return {
      organizationName: providedOrganizationName,
      fullName,
    };
  }

  if (!personNamePattern.test(fullName)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'اسم الشخص غير صالح',
    });
  }

  return {
    organizationName: fullName,
    fullName,
  };
}

function generateSlug(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'اسم المؤسسة غير صالح',
    });
  }

  return slug;
}

async function createUser(input: NewCRMUserInfoInput, name: string) {
  try {
    const { response, headers } = await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name,
        phoneNumber: input.personalInfo.phone,
      },
      returnHeaders: true,
    });

    if (!response.user || !response.token) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'فشل في إنشاء المستخدم - لا يوجد بيانات المستخدم',
      });
    }

    return {
      user: response.user,
      token: response.token,
      headers,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists') || error.message.includes('already taken')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'المستخدم بهذا البريد الإلكتروني موجود بالفعل',
        });
      }
    }

    toUnexpectedTRPCError(error, 'فشل في إنشاء المستخدم');
  }
}

async function deleteUser(token: string, password: string) {
  try {
    await auth.api.deleteUser({
      body: {
        password,
        ...(token ? { token } : {}),
      },
    });
  } catch {}
}

function createOrganizationMetadata(
  input: NewCRMUserInfoInput,
  userId: string
): OrganizationMetadata {
  return {
    createdBy: userId,
    createdAt: new Date().toISOString(),
    type: normalizeOptionalValue(input.companyInfo.name) ? 'company' : 'individual',
    size: input.companyInfo.size ?? '1-10',
    companyWebsite: normalizeOptionalValue(input.companyInfo.website) ?? '',
    companyAddress: normalizeOptionalValue(input.companyInfo.address) ?? '',
  };
}

async function createOrganization(
  organizationName: string,
  userId: string,
  slug: string,
  metadata: OrganizationMetadata
) {
  try {
    const { response, headers } = await auth.api.createOrganization({
      body: {
        name: organizationName,
        slug,
        userId,
        metadata,
      },
      returnHeaders: true,
    });

    if (!response?.id) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create organization - no response',
      });
    }

    return {
      organizationId: response.id,
      headers,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists') || error.message.includes('already taken')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'المؤسسة بهذا الاسم موجودة بالفعل',
        });
      }
    }

    toUnexpectedTRPCError(error, 'فشل في إنشاء المؤسسة');
  }
}

export async function createNewCRM(input: NewCRMUserInfoInput): Promise<CRMCreationResult> {
  try {
    await validateUserInput(input);

    const { organizationName, fullName } = determineOrganizationName(input);
    const { user, token, headers: signUpHeaders } = await createUser(input, fullName);

    try {
      const organizationSlug = generateSlug(organizationName);
      const slugAvailable = await auth.api.checkOrganizationSlug({
        body: {
          slug: organizationSlug,
        },
      });

      if (!slugAvailable) {
        await deleteUser(token, input.password);
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Organization name already taken',
        });
      }

      const metadata = createOrganizationMetadata(input, user.id);
      const { organizationId, headers: organizationHeaders } = await createOrganization(
        organizationName,
        user.id,
        organizationSlug,
        metadata
      );

      sendEmail
        .trigger({
          email: user.email,
          template: EmailTemplate.WELCOME,
        })
        .catch(() => {});

      return {
        data: {
          organizationId,
          organizationSlug,
          userId: user.id,
          status: 'ok',
        },
        headers: toHeadersObject(signUpHeaders, organizationHeaders),
      };
    } catch (error) {
      await deleteUser(token, input.password);
      toUnexpectedTRPCError(error, 'فشل في إنشاء حساب جديد');
    }
  } catch (error) {
    toUnexpectedTRPCError(error, 'فشل في إنشاء حساب جديد');
  }
}
