/** JSON file from backend */
type ChecklistFormJson = {
  blueprint: {
    code: string;
    metadata: BlueprintMetadata;
    structure: BlueprintGroup;
    title: string;
  };
  value: GenericObject;
};
/** --------- */

type BlueprintGroup = {
  type: 'group';
  extra: GenericObject;
  styling: string[];
  name: string;
  repeatable: boolean;
  required: boolean;
  title: string | null;
  children: (BlueprintGroup | BlueprintField)[];
};

type BlueprintField = {
  type: 'field';
  extra: GenericObject;
  styling: string[];
  name: string;
  repeatable: boolean;
  required: boolean;
  input_type: 'text' | 'likert_scale' | 'bool' | 'number' | 'number-integer' | 'number-float'; // add more
  label: string;
  validations: string[];
  help_text: string;
  placeholder: string;
  default_value: null;
  options_key: null;
};

/** Metadata for blueprint structure */
type BlueprintMetadata = {
  options: GenericObject<BlueprintMetadataOptions>;
  validations: GenericObject;
  offline_enabled: boolean;
  allow_multiple_responses: boolean;
};

type BlueprintMetadataOptions = {
  option_type: string;
  values: BlueprintMetadataOption[];
};

type BlueprintMetadataOption = {value: string; label: string};
