type OverallActivities = {
  visits_completed: number;
  visits_planned: number;
};

type PartnersCoverage = {
  id: number;
  name: string;
  completed_visits: number;
  planned_visits: number;
  minimum_required_visits: number;
  days_since_visit: number;
};

type InterventionsCoverage = {
  name: string;
  days_since_visit: number;
  avg_days: number;
};

type CpOutputCoverage = {
  name: string;
  days_since_visit: number;
  avg_days: number;
};
