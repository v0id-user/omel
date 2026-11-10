import {
  CreateDealInput,
  ListDealsInput,
  UpdateDealInput,
  listDealsInputSchema,
} from '../contracts';
import { logCRMActivity } from '@/features/crm/activity/server/service';
import * as repository from './repository';
import { assertReferencesInOrganization } from '@/features/crm/shared/server/ownership';

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
  await assertReferencesInOrganization(organizationId, {
    contactIds: [input.contactId],
    memberIds: [input.ownerId],
  });
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

export async function updateDeal(
  organizationId: string,
  updatedBy: string,
  input: UpdateDealInput
) {
  const { id: dealId, ...dealInput } = input;
  await assertReferencesInOrganization(organizationId, {
    contactIds: [dealInput.contactId],
    memberIds: [dealInput.ownerId],
  });
  const [result] = await repository.updateDeal(organizationId, dealId, updatedBy, dealInput);

  if (result?.id) {
    await logCRMActivity({
      actorId: updatedBy,
      targetId: result.id,
      targetType: 'deal',
      action: 'updated',
      metadata: { fields: Object.keys(dealInput) },
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
