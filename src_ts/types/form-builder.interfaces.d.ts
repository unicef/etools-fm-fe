import {TemplateResult} from 'lit-element';

/** Component for rendering BlueprintGroup with group.extra.type.includes('abstract') or group.name === 'root' */
export interface IFormBuilderAbstractGroup {
  groupStructure: BlueprintGroup;
  groupValue: GenericObject; // setter. _originalValue = groupValue, _value = clone(groupValue);
  parentGroupName: string;
  metadata: BlueprintMetadata;

  // _originalValue: GenericObject; //private property
  // _value: GenericObject; //private property

  /**
   * Updates groupValue object by this.value[fieldName] = event.details.value
   * @param event - comes from event emitted by rendered BlueprintField or BlueprintGroup child of current Group
   * @param fieldName - name field of BlueprintField or BlueprintGroup child of current Group
   *
   * stopsPropagation of current value-changed event it will be replaced with new event
   * Emits value-changed event with updated groupValue
   */
  valueChanged(event: CustomEvent, fieldName: string): void;

  /**
   * Returns template for BlueprintField structure depending of their extra.type
   *
   * without types - standard appearance (label and helper text in left column finding element in right)
   * extra.type.includes('wide') - field takes all parent width
   * extra.type.includes('additional') - gray background
   *
   * Pass value to field as this.value[BlueprintField.name]
   * Rendered field must emit value-changed event
   * Use it to update current group value:
   * @value-changed="${(event) => this.valueChanged(event, BlueprintField.name)}"
   */
  renderField(fieldStructure: BlueprintField, isEditable?: boolean): TemplateResult;

  /**
   * Returns template for BlueprintGroup structure depending of their extra.type
   *
   * extra.type.includes('card') && extra.type.includes('collapse') - render as IDataCollectionCard
   * extra.type.includes('card') - render elevation card
   * extra.type.includes('abstract')  - render as IDataCollectionAbstractGroup
   *
   * Pass groupValue to group as this.value[BlueprintGroup.name]
   * Rendered group must emit value-changed event
   * Use it to update current group value:
   * @value-changed="${(event) => this.valueChanged(event, BlueprintField.name)}"
   */
  renderGroup(groupStructure: BlueprintGroup, groupValue?: GenericObject): TemplateResult;
}

/**
 *  Component for rendering BlueprintGroup as DataCollectionCard.
 *  Computes Card title using parentGroupName mapping + currentGroup.name
 *  Allows to render attachment group and handles their logic
 */
export interface IFormBuilderCollapsedCard extends IFormBuilderAbstractGroup {
  /**
   * Extend renderGroup() method. It must handle additional type:
   *
   * extra.type.includes('floating_attachments') - render as attachment button
   *
   * ---
   * if (extra.type.includes('attachments')) { render attachment button }
   * else { super.renderGroup(groupStructure); }
   *
   */
  renderGroup(groupStructure: BlueprintGroup, groupValue?: GenericObject): TemplateResult;

  /** Override method. It must doing the same but not sending new event only stop current. value-changed will be send letter */
  valueChanged(event: CustomEvent, fieldName: string): void;

  /**
   * Use openDialog method. Call valueChanged() on popup resolve with confirmed === true
   */
  openAttachmentsPopup(): void;

  /**
   * Emits two events:
   * First - value-changed for updating changed value
   * Second - save-data for saving data in parent top level component
   */
  saveChanges(): void;

  cancelEdit(): void;
  startEdit(): void;
}

export interface IFormBuilderCard {
  cardInvalid: boolean;
  /** compares value, update value, manage save button displaying */
  cardValueChanged(value: GenericObject): void;

  /**
   * Show toastr if card is invalid, returns;
   * Emits two events:
   * First - value-changed for updating changed value
   * Second - save-data for saving data in parent top level component
   */
  saveChanges(): void;
}
