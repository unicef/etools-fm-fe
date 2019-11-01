
export function overallStatisticsProgressbarDataConverter(data: OverallActivities): ProgressBarData {
    return {
        completed: data.visits_completed,
        planned: data.visits_planned,
        minRequired: 0,
        daysSinceLastVisit: 0,
        additionalCompletedLabelValue: ' Visits',
        additionalPlannedLabelValue: ' Visits (Up to December)',
        progressBarLabelsColor: 'grey',
        completedDivBackgroundColor: '#4d9dd6'
    };
}

export function initProgressbarData(): ProgressBarData {
    return {
        completed: 0,
        planned: 0,
        minRequired: 0,
        daysSinceLastVisit: 0,
        additionalCompletedLabelValue: '',
        additionalPlannedLabelValue: '',
        progressBarLabelsColor: '',
        completedDivBackgroundColor: ''
    };
}
