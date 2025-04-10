import { z } from 'zod';

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

    const data = await response.json();

    // Check if the email is valid according to the API
    // You can adjust the validation logic based on the API response fields
    return data.is_valid_format?.value === true;
  } catch (error) {
    console.error('Email validation API error:', error);
    // Fall back to basic validation
    return basicEmailValidation(email);
  }
}

/**
 * Basic email validation fallback with Zod
 */

const emailSchema = z.string().email();

function basicEmailValidation(email: string): boolean {
  // TODO: Add validation for disposable emails and more validations
  return emailSchema.safeParse(email).success;
}
