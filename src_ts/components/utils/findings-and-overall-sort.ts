/**
 * combines findings and overall finding in one object by Partner/Cp Output/PD SPD
 */
import {get} from '@unicef-polymer/etools-unicef/src/etools-translate';

export function sortFindingsAndOverall(
  overallData: (DataCollectionOverall | SummaryOverall)[] | null,
  findings: (DataCollectionFinding | SummaryFinding)[] | null
): GenericObject<SortedFindingsAndOverall> {
  if (overallData === null || findings === null) {
    return {};
  }

  const findingsAndOverall: GenericObject<SortedFindingsAndOverall> = overallData.reduce(
    (result: GenericObject<SortedFindingsAndOverall>, overall: DataCollectionOverall | SummaryOverall) => {
      // generate unique id
      const id: string = getDataKey(overall);
      // name exists in findings data, findings will be populated if findings iteration
      result[id] = {name: '', findings: [], overall};
      return result;
    },
    {}
  );

  findings.forEach((finding: DataCollectionFinding | SummaryFinding) => {
    const id: string = getDataKey(finding.activity_question);
    if (id && findingsAndOverall[id]) {
      findingsAndOverall[id].name = getTargetName(finding.activity_question);
      findingsAndOverall[id].findings.push(finding);
    }
  });
  return findingsAndOverall;
}

function getDataKey(dataObject: DataCollectionOverall | IChecklistItem | ISummaryChecklistItem): string {
  if (dataObject.partner) {
    const id: number = typeof dataObject.partner === 'object' ? dataObject.partner.id : dataObject.partner;
    return `partner_${id}`;
  } else if (dataObject.cp_output) {
    const id: number = typeof dataObject.cp_output === 'object' ? dataObject.cp_output.id : dataObject.cp_output;
    return `cp_output_${id}`;
  } else if (dataObject.intervention) {
    const id: number =
      typeof dataObject.intervention === 'object' ? dataObject.intervention.id : dataObject.intervention;
    return `intervention_${id}`;
  } else {
    return '';
  }
}

function getTargetName(checklist: IChecklistItem | ISummaryChecklistItem): string {
  if (checklist.partner) {
    return `${get('LEVELS_OPTIONS.PARTNER')}: ${checklist.partner.name}`;
  } else if (checklist.cp_output) {
    return `${get('LEVELS_OPTIONS.OUTPUT')}: ${checklist.cp_output.name}`;
  } else if (checklist.intervention) {
    return `${get('LEVELS_OPTIONS.INTERVENTION')}: ${checklist.intervention.title}`;
  } else {
    return '';
  }
}
