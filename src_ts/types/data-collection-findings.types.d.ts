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
