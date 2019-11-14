type Attachment = {
  id: number;
  filename: string;
  file_type: number;
  file: string | File | null;
  hyperlink: string;
  created: string;
  modified: string;
  uploaded_by: null;
};

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
  editedAttachment?: Attachment;
  attachmentTypes: DefaultDropdownOption[];
  endpointName: string;
  additionalEndpointData: GenericObject;
}
