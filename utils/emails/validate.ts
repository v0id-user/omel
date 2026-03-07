import { z } from 'zod';

const disposableEmailDomains = new Set([
  '10minutemail.com',
  'dispostable.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'trashmail.com',
  'yopmail.com',
]);

const emailSchema = z.string().trim().email().max(254);

type AbstractEmailValidationResponse = {
  deliverability?: string;
  is_disposable_email?: { value?: boolean };
  is_mx_found?: { value?: boolean };
  is_valid_format?: { value?: boolean };
};

/**
 * Validates an email address using the Abstract API
 * Falls back to basic validation if the API call fails
 */
export async function validateEmail(email: string): Promise<boolean> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.ABSTRACT_API_KEY;
    if (!apiKey) {
      console.warn('Abstract API key not found in environment variables');
      return basicEmailValidation(email);
    }

    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as AbstractEmailValidationResponse;

    // Check if the email is valid according to the API
    // You can adjust the validation logic based on the API response fields
    if (data.is_valid_format?.value !== true) {
      return false;
    }

    if (data.is_disposable_email?.value === true) {
      return false;
    }

    if (data.is_mx_found?.value === false) {
      return false;
    }

    return data.deliverability !== 'UNDELIVERABLE';
  } catch (error) {
    console.error('Email validation API error:', error);
    // Fall back to basic validation
    return basicEmailValidation(email);
  }
}

/**
 * Basic email validation fallback with Zod
 */

function basicEmailValidation(email: string): boolean {
  // TODO: Add validation for disposable emails and more validations
  const normalizedEmail = email.trim().toLowerCase();
  if (!emailSchema.safeParse(normalizedEmail).success) {
    return false;
  }

  const [localPart, domain] = normalizedEmail.split('@');
  if (!localPart || !domain) {
    return false;
  }

  if (
    localPart.length > 64 ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..')
  ) {
    return false;
  }

  if (
    domain.length > 253 ||
    domain.startsWith('.') ||
    domain.endsWith('.') ||
    domain.includes('..') ||
    disposableEmailDomains.has(domain)
  ) {
    return false;
  }

  const domainLabels = domain.split('.');
  if (domainLabels.length < 2) {
    return false;
  }

  const hasInvalidDomainLabel = domainLabels.some(
    label =>
      label.length === 0 ||
      label.length > 63 ||
      label.startsWith('-') ||
      label.endsWith('-') ||
      !/^[a-z0-9-]+$/.test(label)
  );

  if (hasInvalidDomainLabel) {
    return false;
  }

  const topLevelDomain = domainLabels[domainLabels.length - 1];
  return /^[a-z]{2,}$/i.test(topLevelDomain);
}
