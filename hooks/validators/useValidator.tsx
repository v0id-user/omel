import { ValidationType } from './enums';
import { useState } from 'react';
export function useClientValidations() {
  const [isLoading, setIsLoading] = useState(false);
  const validator = (type: ValidationType, value: string) => {
    switch (type) {
    }
  };

  return {
    isLoading,
    validator,
  };
}
