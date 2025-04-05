import { ValidationType } from './enums';
import { useState } from 'react';
import {
  clientValidateEmailInput,
  clientValidatePasswordInput,
  clientValidatePhoneInput,
} from '@/utils/client/validators';
import { trpc } from '@/trpc/client';

export function useClientValidations() {
  const [isLoading, setIsLoading] = useState(false);

  const emailValidationRpc = trpc.validations.validateEmail.useMutation();
  const phoneValidationRpc = trpc.validations.validatePhone.useMutation();
  const validators = {
    [ValidationType.Email]: async (value: string) => {
      const isValidInput = clientValidateEmailInput(value);
      if (isValidInput !== undefined) return false;

      return await emailValidationRpc.mutateAsync(value);
    },
    [ValidationType.Password]: async (value: string) => {
      const isValidInput = clientValidatePasswordInput(value);
      if (isValidInput !== undefined) return false;
      return isValidInput;
    },
    [ValidationType.Phone]: async (value: string) => {
      const isValidInput = clientValidatePhoneInput(value);
      if (isValidInput !== undefined) return false;
      return await phoneValidationRpc.mutateAsync(value);
    },
  };

  const validator = async (type: ValidationType, value: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const validate = validators[type];
      return validate ? !!(await validate(value)) : false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    validator,
  };
}
