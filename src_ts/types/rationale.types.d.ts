interface IRationale {
  prioritization_criteria: string;
  methodology_notes: string;
  target_visits: number;
  modalities: string;
  partner_engagement: string;
  other_aspects: string;
  history: RationaleHistoryItem[];
}

type RationaleHistoryItem = {
  id: number;
  created: string;
  by_user_display: string;
  action: string;
};

type RationaleModalData = {
  model?: IRationale;
  year?: number;
};
