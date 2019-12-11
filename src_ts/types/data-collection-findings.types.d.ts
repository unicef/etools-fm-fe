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

interface ISummaryChecklistItem extends IChecklistItem {
  findings: CompletedFinding[];
}

type DataCollectionFinding = {
  id: number;
  activity_question: IChecklistItem;
  value: null | string | number;
};

type SummaryFinding = {
  id: number;
  activity_question: ISummaryChecklistItem;
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

type SummaryOverall = DataCollectionOverall & {
  findings: CompletedOverallFinding[];
  on_track: null | boolean;
};

type SortedFindingsAndOverall = {
  name: string;
  overall: DataCollectionOverall;
  findings: DataCollectionFinding[];
};

type DataCollectionRequestData<T = DataCollectionFinding, U = DataCollectionOverall> = {
  overall?: Partial<U>;
  findings?: Partial<T>[];
};

type AttachmentsPopupData = {
  attachments: IAttachment[];
  updateUrl?: string;
  title: string;
};

type RequestChecklistAttachment = {
  id?: number;
  file_type?: number | string;
  attachment?: number;
  _delete?: true;
};

type CompletedOverallFinding = {
  author: ActivityTeamMember;
  method: number;
  information_source: string;
  narrative_finding: string;
};

type CompletedFinding = {
  id: number;
  author: ActivityTeamMember;
  method: number;
  value: string;
};

type CollectChecklistParams = {
  information_source?: string;
  method: number;
};
