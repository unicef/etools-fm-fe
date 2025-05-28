interface IAttachment {
  id: number;
  filename: string;
  file_type: number;
  file_type_name: string;
  file: string | File | null;
  hyperlink: string;
  created: string;
  modified: string;
  uploaded_by: null;
}

interface IEditedAttachment extends IAttachment {
  _delete?: true;
}

type AttachmentFile = {
  id?: number | null;
  file_name: string;
  path?: string | null;
  raw?: File;
};

interface IRemmoveAttachmentPopupData {
  id: number;
  endpointName: string;
  additionalEndpointData: GenericObject;
}

interface IAttachmentPopupData {
  editedAttachment?: IAttachment;
  attachmentTypes: AttachmentType[];
  endpointName: string;
  additionalEndpointData: GenericObject;
}

type StoredAttachment = {
  agreement_reference_number: string;
  attachment: number;
  created: string;
  file_link: string;
  file_type: string;
  filename: string;
  id: number;
  object_link: string;
  partner: string;
  partner_type: string;
  pd_ssfa: null;
  pd_ssfa_number: string;
  source: string;
  uploaded_by: string;
  vendor_number: string;
};

interface IChecklistAttachment extends IAttachment {
  checklist: DataCollectionChecklist;
  partner: null | IActivityPartner;
  cp_output: null | IActivityCPOutput;
  intervention: null | IActivityIntervention;
}

type AttachmentType = {
  id: number;
  label: string;
};
