'use client';

import { DashboardDialog } from '@/components/dashboard/Dialog';
import { UserPlus, ArrowLeft, ArrowRight } from 'iconoir-react';
import { OButton } from '@/components/omel/Button';
import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { clientValidateEmailInput, clientValidatePhoneInput } from '@/utils/client/validators';
import { ClientData, ClientType, ClientsDialogProps, FormStep } from './types';
import { ProgressIndicator } from './components/ProgressIndicator';
import { ClientTypeStep } from './forms/ClientTypeStep';
import { BasicInfoStep } from './forms/BasicInfoStep';
import { ContactInfoStep } from './forms/ContactInfoStep';
import { CompanyDetailsStep } from './forms/CompanyDetailsStep';
import { CompletionStep } from './forms/CompletionStep';

export function AddClientsDialog({ isOpen, onClose }: ClientsDialogProps) {
  // State for current step and data
  const [currentStep, setCurrentStep] = useState<FormStep>('type');
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    country: '',
    postalCode: '',
    clientType: 'person',
    companyFields: {
      domain: '',
      additionalPhones: [''],
      taxId: '',
      businessType: '',
      employees: '',
    },
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'companyFields' && clientData.companyFields) {
        setClientData({
          ...clientData,
          companyFields: {
            ...clientData.companyFields,
            [child]: value,
          },
        });
      }
    } else {
      setClientData({
        ...clientData,
        [field]: value,
      });
    }

    // Clear error when field is edited
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  // Handle client type selection
  const handleClientTypeChange = (type: ClientType) => {
    setClientData({
      ...clientData,
      clientType: type,
    });
  };

  // Add additional phone for company
  const handleAddPhone = () => {
    if (clientData.companyFields) {
      setClientData({
        ...clientData,
        companyFields: {
          ...clientData.companyFields,
          additionalPhones: [...clientData.companyFields.additionalPhones, ''],
        },
      });
    }
  };

  // Remove an additional phone
  const handleRemovePhone = (index: number) => {
    if (clientData.companyFields) {
      const newPhones = [...clientData.companyFields.additionalPhones];
      newPhones.splice(index, 1);
      setClientData({
        ...clientData,
        companyFields: {
          ...clientData.companyFields,
          additionalPhones: newPhones,
        },
      });
    }
  };

  // Handle phone input change for additional phones
  const handlePhoneChange = (index: number, value: string) => {
    if (clientData.companyFields) {
      const newPhones = [...clientData.companyFields.additionalPhones];
      newPhones[index] = value;
      setClientData({
        ...clientData,
        companyFields: {
          ...clientData.companyFields,
          additionalPhones: newPhones,
        },
      });
    }
  };

  // Validate the current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'basicInfo') {
      if (!clientData.name) newErrors.name = 'الاسم مطلوب';

      if (clientData.email) {
        const emailError = clientValidateEmailInput(clientData.email);
        if (emailError) newErrors.email = emailError;
      }
    }

    if (currentStep === 'contactInfo') {
      if (clientData.phone) {
        const phoneError = clientValidatePhoneInput(clientData.phone);
        if (phoneError) newErrors.phone = phoneError;
      }
    }

    if (currentStep === 'companyDetails' && clientData.clientType === 'company') {
      if (clientData.companyFields?.domain) {
        const domainSchema = z.string().url().optional();
        const result = domainSchema.safeParse(clientData.companyFields.domain);
        if (!result.success) {
          newErrors['companyFields.domain'] = 'عنوان الموقع غير صالح';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Move to the next step
  const nextStep = () => {
    if (!validateStep()) return;

    if (currentStep === 'type') {
      setCurrentStep('basicInfo');
    } else if (currentStep === 'basicInfo') {
      setCurrentStep('contactInfo');
    } else if (currentStep === 'contactInfo') {
      if (clientData.clientType === 'company') {
        setCurrentStep('companyDetails');
      } else {
        setCurrentStep('complete');
      }
    } else if (currentStep === 'companyDetails') {
      setCurrentStep('complete');
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (currentStep === 'basicInfo') {
      setCurrentStep('type');
    } else if (currentStep === 'contactInfo') {
      setCurrentStep('basicInfo');
    } else if (currentStep === 'companyDetails') {
      setCurrentStep('contactInfo');
    } else if (currentStep === 'complete') {
      if (clientData.clientType === 'company') {
        setCurrentStep('companyDetails');
      } else {
        setCurrentStep('contactInfo');
      }
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // TODO: Implement the actual client creation API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      toast.success('تم إضافة العميل بنجاح');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء إضافة العميل');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <ClientTypeStep
            clientData={clientData}
            onClientDataChange={handleChange}
            errors={errors}
            onClientTypeChange={handleClientTypeChange}
          />
        );

      case 'basicInfo':
        return (
          <BasicInfoStep
            clientData={clientData}
            onClientDataChange={handleChange}
            errors={errors}
          />
        );

      case 'contactInfo':
        return (
          <ContactInfoStep
            clientData={clientData}
            onClientDataChange={handleChange}
            errors={errors}
          />
        );

      case 'companyDetails':
        return (
          <CompanyDetailsStep
            clientData={clientData}
            onClientDataChange={handleChange}
            errors={errors}
            onAddPhone={handleAddPhone}
            onRemovePhone={handleRemovePhone}
            onPhoneChange={handlePhoneChange}
          />
        );

      case 'complete':
        return (
          <CompletionStep
            clientData={clientData}
            onClientDataChange={handleChange}
            errors={errors}
          />
        );

      default:
        return null;
    }
  };

  return (
    <DashboardDialog
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة عميل"
      icon={<UserPlus className="w-4 h-4" />}
    >
      <div className="flex flex-col gap-6 pt-5 px-5">
        {/* Progress bar */}
        <ProgressIndicator currentStep={currentStep} clientType={clientData.clientType} />

        {/* Form content */}
        <div className="min-h-[300px]">{renderStepContent()}</div>

        {/* Buttons */}
        <div className="flex gap-3 justify-between mt-4 mb-2">
          {currentStep !== 'type' ? (
            <OButton variant="ghost" onClick={prevStep} className="flex items-center gap-1">
              <ArrowRight className="w-4 h-4" /> السابق
            </OButton>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}

          {currentStep !== 'complete' ? (
            <OButton variant="primary" onClick={nextStep} className="flex items-center gap-1">
              التالي <ArrowLeft className="w-4 h-4" />
            </OButton>
          ) : (
            <OButton variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
              إضافة العميل
            </OButton>
          )}
        </div>
      </div>
    </DashboardDialog>
  );
}
