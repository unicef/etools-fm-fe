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
  id: number;
  number: string;
  days_since_visit: number | null;
  avg_days_between_visits: number | null;
};

type CpOutputCoverage = {
  id: number;
  number: string;
  days_since_visit: number | null;
  avg_days_between_visits: number | null;
};

type GeographicCoverage = {
  id: number;
  name: string;
  completed_visits: number;
  geom: LocationGeometry;
};

type OpenIssuesActionPoints = {
  id: number;
  name: string;
  log_issues_count: number;
  action_points_count: number;
};

type HactVisitsActivity = {
  name: string;
  cp_outputs: string;
  interventions: string;
  end_date: string;
};

type HactVisits = {
  id: number;
  name: string;
  visits: HactVisitsActivity[];
  visits_count: number;
};