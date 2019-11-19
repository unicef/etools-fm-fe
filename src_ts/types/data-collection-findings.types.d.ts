type DataCollectionChecklist = {
  id: number;
  method: number;
  information_source: string;
  author: {
    id: number;
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

type DataCollectionFinding = {
  id: number;
  activity_question: IChecklistItem;
  value: null | string | number;
};

type DataCollectionOverall = {
  id: number;
  partner: null | number;
  cp_output: null | number;
  intervention: null | number;
  narrative_finding: string;
  attachments: [];
};

type SortedFindingsAndOverall = {
  name: string;
  overall: DataCollectionOverall;
  findings: DataCollectionFinding[];
};

type DataCollectionRequestData = {
  overall?: Partial<DataCollectionOverall>;
  findings?: Partial<DataCollectionFinding>[];
};

type AttachmentsPopupData = {
  attachments: IAttachment[];
  updateUrl: string;
  title: string;
};

type RequestChecklistAttachment = {
  id?: number;
  file_type?: number | string;
  attachment?: number;
  delete?: true;
};

type AttachmentDialogResponse = {
  noChanges: boolean;
};

type CollectChecklistParams = {
  information_source?: string;
  method: number;
};
