type ProgressBarData = {
    completed: number;
    planned: number;
    minRequired: number | null;
    daysSinceLastVisit: number | null;
    additionalCompletedLabelValue: string | null;
    additionalPlannedLabelValue: string | null;
    progressBarLabelsColor: string;
    completedDivBackgroundColor: string;
};

type ProgressBarDataWithHeadline = {
    headline: string;
    progressbarData: ProgressBarData;
};
