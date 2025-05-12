import { ContactType } from '@/database/types/contacts';

export type ClientType = ContactType;

// Client data model
export interface ClientData {
  // Basic info
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  clientType: ClientType;

  // Additional company fields
  companyFields?: {
    domain: string;
    additionalPhones: string[];
    taxId: string;
    businessType: string;
    employees: string;
  };
}

// Form steps
export type FormStep = 'type' | 'basicInfo' | 'contactInfo' | 'companyDetails' | 'complete';

// Props interfaces
export interface ClientsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface StepProps {
  clientData: ClientData;
  onClientDataChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  onClientTypeChange?: (type: ClientType) => void;
  onAddPhone?: () => void;
  onRemovePhone?: (index: number) => void;
  onPhoneChange?: (index: number, value: string) => void;
}
