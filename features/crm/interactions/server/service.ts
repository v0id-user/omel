import { logCRMActivity } from '@/features/crm/activity/server/service';
import {
  CreateInteractionInput,
  ListInteractionsInput,
  UpdateInteractionInput,
  listInteractionsInputSchema,
} from '../contracts';
import * as repository from './repository';
import { assertReferencesInOrganization } from '@/features/crm/shared/server/ownership';

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
  await assertReferencesInOrganization(organizationId, {
    contactIds: [input.contactId],
    dealIds: [input.dealId],
    taskIds: [input.taskId],
  });
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
  organizationId: string,
  updatedBy: string,
  input: UpdateInteractionInput
) {
  const { id: interactionId, ...interactionInput } = input;
  await assertReferencesInOrganization(organizationId, {
    contactIds: [interactionInput.contactId],
    dealIds: [interactionInput.dealId],
    taskIds: [interactionInput.taskId],
  });
  const [result] = await repository.updateInteraction(
    organizationId,
    interactionId,
    updatedBy,
    interactionInput
  );

  if (result?.id) {
    await logCRMActivity({
      actorId: updatedBy,
      targetId: result.id,
      targetType: 'interaction',
      action: 'updated',
      metadata: { fields: Object.keys(interactionInput) },
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
