import {TemplateResult} from 'lit-element';

/** Component for rendering BlueprintGroup with group.extra.type.includes('abstract') or group.name === 'root' */
export interface IFormBuilderAbstractGroup {
  groupStructure: BlueprintGroup;
  metadata: BlueprintMetadata;
  parentGroupName: string;
  readonly: boolean;
  value: GenericObject;

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
   * Returns template for BlueprintField structure depending on their styling
   *
   * without styling (empty array) - standard appearance (label and helper text in left column field element in right)
   * styling.includes('wide') - field takes all parent width
   * styling.includes('additional') - gray background
   *
   * Pass value to field as this.value[BlueprintField.name]
   * Rendered field must emit value-changed event
   * Use it to update current group value:
   * @value-changed="${(event) => this.valueChanged(event, BlueprintField.name)}"
   */
  renderField(fieldStructure: BlueprintField): TemplateResult;

  /**
   * Returns template for BlueprintGroup structure depending on their styling
   *
   * styling.includes('card') && styling.includes('collapse') - render as IFormBuilderCollapsedCard
   * styling.includes('card') - render as IFormBuilderCard
   * styling.includes('abstract')  - render as IFormBuilderAbstractGroup recursively
   *
   * Pass groupValue to group as this.value[BlueprintGroup.name]
   * Rendered group must emit value-changed event
   * Use it to update current group value:
   * @value-changed="${(event) => this.valueChanged(event, BlueprintGroup.name)}"
   */
  renderGroup(groupStructure: BlueprintGroup, groupValue?: GenericObject): TemplateResult;
}

interface IFormBuilderCard extends IFormBuilderAbstractGroup {
  /**
   * Overrides parent method.
   * It must doing the same but not sending new event, only stop current.
   * value-changed will be send latter
   */
  valueChanged(event: CustomEvent, fieldName: string): void;

  /**
   * Show toastr if card has errors, returns;
   * Emits value-changed event for updating changed value
   */
  saveChanges(): void;
}

/**
 *  Component for rendering BlueprintGroup as DataCollectionCard.
 *  Computes Card title using parentGroupName mapping + currentGroup.name
 *  Allows to render attachment group and handles their logic
 */
export interface IFormBuilderCollapsedCard extends IFormBuilderAbstractGroup, IFormBuilderCard {
  /**
   * Extend renderGroup() method. It must handle additional type:
   *
   * styling.includes('floating_attachments') - render group as attachment button
   *
   * ---
   * if (styling.includes('floating_attachments')) { ...render attachment button... }
   * else { super.renderGroup(groupStructure); }
   *
   */
  renderGroup(groupStructure: BlueprintGroup, groupValue?: GenericObject): TemplateResult;

  /**
   * Use openDialog method. Call valueChanged() on popup resolve with confirmed === true
   */
  openAttachmentsPopup(): void;

  cancelEdit(): void;
  startEdit(): void;
}
