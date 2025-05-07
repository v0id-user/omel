'use client';

import { ClientType, FormStep } from '../types';
import React from 'react';
import { ProgressBar } from '@/components/ui/progress-bar';
interface ProgressIndicatorProps {
  currentStep: FormStep;
  clientType: ClientType;
}

export function ProgressIndicator({ currentStep, clientType }: ProgressIndicatorProps) {
  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    const totalSteps = clientType === 'company' ? 4 : 3;
    const currentStepIndex = [
      'type',
      'basicInfo',
      'contactInfo',
      'companyDetails',
      'complete',
    ].indexOf(currentStep);
    return Math.min(100, (currentStepIndex / totalSteps) * 100);
  };

  return (
    <>
      {/* TODO: Simple TimeLine Progress With Icons */}

      {/* Progress bar */}
      <ProgressBar progress={getProgressPercentage()} />

      {/* Progress indicator text */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {currentStep === 'complete'
            ? 'الخطوة الأخيرة'
            : 'الخطوة ' +
              Math.min(
                4,
                ['type', 'basicInfo', 'contactInfo', 'companyDetails', 'complete'].indexOf(
                  currentStep
                ) + 1
              ) +
              ' من ' +
              (clientType === 'company' ? '4' : '3')}
        </span>
        <span>{Math.round(getProgressPercentage())}%</span>
      </div>
    </>
  );
}
