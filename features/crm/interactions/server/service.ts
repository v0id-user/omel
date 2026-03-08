import { logCRMActivity } from '@/features/crm/activity/server/service';
import {
  CreateInteractionInput,
  ListInteractionsInput,
  UpdateInteractionInput,
  listInteractionsInputSchema,
} from '../contracts';
import * as repository from './repository';

export async function listInteractionsForOrganization(
  organizationId: string,
  input: Partial<ListInteractionsInput> = {}
) {
  const validatedInput = listInteractionsInputSchema.parse(input);
  return repository.listInteractionsForOrganization(organizationId, validatedInput);
}

export async function getInteractionById(organizationId: string, interactionId: string) {
  return repository.getInteractionById(organizationId, interactionId);
}

export async function createNewInteraction(
  organizationId: string,
  createdBy: string,
  input: CreateInteractionInput
) {
  const [result] = await repository.createInteraction(organizationId, createdBy, input);

  if (result?.id) {
    await logCRMActivity({
      actorId: createdBy,
      targetId: result.id,
      targetType: 'interaction',
      action: 'created',
      metadata: {
        type: input.type,
        contactId: input.contactId,
        dealId: input.dealId,
      },
    });
  }

  return result;
}

export async function updateInteraction(
  interactionId: string,
  updatedBy: string,
  input: UpdateInteractionInput
) {
  const [result] = await repository.updateInteraction(interactionId, updatedBy, input);

  if (result?.id) {
    await logCRMActivity({
      actorId: updatedBy,
      targetId: result.id,
      targetType: 'interaction',
      action: 'updated',
      metadata: input,
    });
  }

  return result;
}

export async function deleteInteraction(
  organizationId: string,
  deletedBy: string,
  interactionId: string
) {
  const [result] = await repository.deleteInteraction(organizationId, interactionId);

  if (result?.id) {
    await logCRMActivity({
      actorId: deletedBy,
      targetId: result.id,
      targetType: 'interaction',
      action: 'deleted',
    });
  }

  return result;
}
