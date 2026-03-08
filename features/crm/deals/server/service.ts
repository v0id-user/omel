import {
  CreateDealInput,
  ListDealsInput,
  UpdateDealInput,
  listDealsInputSchema,
} from '../contracts';
import { logCRMActivity } from '@/features/crm/activity/server/service';
import * as repository from './repository';

export async function listDealsForOrganization(
  organizationId: string,
  input: Partial<ListDealsInput> = {}
) {
  const validatedInput = listDealsInputSchema.parse(input);
  return repository.getDealsForOrganization(organizationId, validatedInput);
}

export async function getDealById(organizationId: string, dealId: string) {
  return repository.getDealById(organizationId, dealId);
}

export async function getDealsByContactId(organizationId: string, contactId: string) {
  return repository.getDealsByContactId(organizationId, contactId);
}

export async function createNewDeal(
  organizationId: string,
  createdBy: string,
  input: CreateDealInput
) {
  const [result] = await repository.createDeal(organizationId, createdBy, input);

  if (result?.id) {
    await logCRMActivity({
      actorId: createdBy,
      targetId: result.id,
      targetType: 'deal',
      action: 'created',
      metadata: {
        title: input.title,
        stage: input.stage ?? 'lead',
        status: input.status ?? 'open',
      },
    });
  }

  return result;
}

export async function updateDeal(dealId: string, updatedBy: string, input: UpdateDealInput) {
  const [result] = await repository.updateDeal(dealId, updatedBy, input);

  if (result?.id) {
    await logCRMActivity({
      actorId: updatedBy,
      targetId: result.id,
      targetType: 'deal',
      action: 'updated',
      metadata: input,
    });
  }

  return result;
}

export async function deleteDeal(organizationId: string, deletedBy: string, dealId: string) {
  const [result] = await repository.deleteDeal(organizationId, dealId);

  if (result?.id) {
    await logCRMActivity({
      actorId: deletedBy,
      targetId: result.id,
      targetType: 'deal',
      action: 'deleted',
    });
  }

  return result;
}

export async function getDealSummary(organizationId: string) {
  return repository.getDealSummary(organizationId);
}
