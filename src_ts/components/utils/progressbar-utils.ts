export function initProgressbarData(): ProgressBarData {
    return {
        completed: 0,
        planned: 0,
        minRequired: null,
        daysSinceLastVisit: null,
        additionalCompletedLabelValue: null,
        additionalPlannedLabelValue: null,
        progressBarLabelsColor: '',
        completedDivBackgroundColor: ''
    };
}

export function convertOverallStatisticsProgressbarData(data: OverallActivities): ProgressBarData {
    return {
        completed: data.visits_completed,
        planned: data.visits_planned,
        minRequired: null,
        daysSinceLastVisit: null,
        additionalCompletedLabelValue: ' Visits',
        additionalPlannedLabelValue: ' Visits (Up to December)',
        progressBarLabelsColor: 'grey',
        completedDivBackgroundColor: '#3F9BBC'
    };
}

export function convertPartnersCoverageProgressbarData(data: PartnersCoverage): ProgressBarData {
    return {
        completed: data.completed_visits,
        planned: data.planned_visits,
        minRequired: data.minimum_required_visits,
        daysSinceLastVisit: data.days_since_visit,
        additionalCompletedLabelValue: null,
        additionalPlannedLabelValue: null,
        progressBarLabelsColor: 'grey',
        completedDivBackgroundColor: '#48B6C2'
    };
}
