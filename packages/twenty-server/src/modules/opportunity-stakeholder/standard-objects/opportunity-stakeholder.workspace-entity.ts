import { msg } from '@lingui/core/macro';
import {
  ActorMetadata,
  FieldMetadataType,
  RelationOnDeleteAction,
} from 'twenty-shared/types';
import { STANDARD_OBJECT_IDS } from 'twenty-shared/metadata';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.opportunityStakeholder,
  namePlural: 'opportunityStakeholders',
  labelSingular: msg`Opportunity stakeholder`,
  labelPlural: msg`Opportunity stakeholders`,
  description: msg`A mapping of the people involved in a deal and how to work with them`,
  icon: STANDARD_OBJECT_ICONS.opportunityStakeholder,
  labelIdentifierStandardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.role,
})
export class OpportunityStakeholderWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceRelation({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.opportunity,
    type: RelationType.MANY_TO_ONE,
    label: msg`Opportunity`,
    description: msg`Deal connected to this stakeholder entry`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => OpportunityWorkspaceEntity,
    inverseSideFieldKey: 'stakeholders',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  opportunity: Relation<OpportunityWorkspaceEntity>;

  @WorkspaceJoinColumn('opportunity')
  opportunityId: string;

  @WorkspaceRelation({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.person,
    type: RelationType.MANY_TO_ONE,
    label: msg`Person`,
    description: msg`Contact represented in the deal room`,
    icon: 'IconUser',
    inverseSideTarget: () => PersonWorkspaceEntity,
    inverseSideFieldKey: 'opportunityStakeholders',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  person: Relation<PersonWorkspaceEntity> | null;

  @WorkspaceJoinColumn('person')
  personId: string | null;

  @WorkspaceField({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.role,
    type: FieldMetadataType.TEXT,
    label: msg`Role`,
    description: msg`How this stakeholder participates in the evaluation`,
    icon: 'IconHierarchy2',
  })
  role: string;

  @WorkspaceField({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.influenceLevel,
    type: FieldMetadataType.SELECT,
    label: msg`Influence`,
    description: msg`Level of influence this person has on the deal`,
    icon: 'IconAdjustmentsBolt',
    options: [
      { value: 'BLOCKER', label: 'Blocker', position: 0, color: 'red' },
      { value: 'NEUTRAL', label: 'Neutral', position: 1, color: 'yellow' },
      { value: 'CHAMPION', label: 'Champion', position: 2, color: 'green' },
    ],
    defaultValue: "'NEUTRAL'",
  })
  influenceLevel: string;

  @WorkspaceField({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.engagement,
    type: FieldMetadataType.SELECT,
    label: msg`Engagement`,
    description: msg`How engaged this person is with the sales motion`,
    icon: 'IconMessageChatbot',
    options: [
      { value: 'LOW', label: 'Low', position: 0, color: 'gray' },
      { value: 'MEDIUM', label: 'Medium', position: 1, color: 'blue' },
      { value: 'HIGH', label: 'High', position: 2, color: 'green' },
    ],
    defaultValue: "'MEDIUM'",
  })
  engagement: string;

  @WorkspaceField({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.notes,
    type: FieldMetadataType.TEXT,
    label: msg`Notes`,
    description: msg`Context to align the team around how to work with this person`,
    icon: 'IconNotebook',
  })
  @WorkspaceIsNullable()
  notes: string | null;

  @WorkspaceField({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Stakeholder record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: OPPORTUNITY_STAKEHOLDER_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`Creator of this stakeholder entry`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;
}
