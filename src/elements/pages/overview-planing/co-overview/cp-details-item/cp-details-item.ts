class CpDetailsItem extends  EtoolsMixinFactory.combineMixins([FMMixins.AppConfig], Polymer.Element) {
    public static get is() { return 'cp-details-item'; }

    public static get properties() {
        return {
            cpItem: {
                type: Object,
                value: () => ({})
            },
            fullReport: {
                type: Object,
                value: () => ({})
            }
        };
    }

    public getCpIndicators(indicators: RamIndicator[]): string[] {
        return R.pipe(
            R.map((indicator: RamIndicator) => indicator.ram_indicators),
            R.flatten,
            R.map((indicator: NestedIndicator) => indicator.indicator_name)
        )(indicators);
    }

    public getBackground(index: number) {
        return index % 2 ? 'gray' : '';
    }

    public indicatorsEmpty(indicators: RamIndicator[]): boolean {
        return !this.getCpIndicators(indicators).length;
    }

    public toggleDetails({ model }: EventModel<FullReportIntervention>) {
        const { intervention, parentModel } = model;
        const { partner } = parentModel;
        const partnerIndex = !!partner && this.fullReport.partners.findIndex(
            (partnerData: FullReportPartner) => partnerData.id === partner.id
        );
        const interventionIndex = !!intervention && !isNaN(partnerIndex) && partnerIndex !== -1 &&
            this.fullReport.partners[partnerIndex].interventions.findIndex(
            (interventionData: FullReportIntervention) => interventionData.pk === intervention.pk
        );
        if (isNaN(interventionIndex) || interventionIndex === -1) {
            throw new Error('Can not find data in array');
        }
        const path = `fullReport.partners.${partnerIndex}.interventions.${interventionIndex}.detailsOpened`;
        const currentValue = this.get(path);
        this.set(path, !currentValue);
    }

    public getExpectedResults(interventionPk: number, resultLinks: FullReportResultLink[]) {
        const result = resultLinks.find((link: FullReportResultLink) => link.intervention === interventionPk);
        return result && result.ll_results
            .map((expectedResult: LowResult, index: number) => `${index + 1}) ${expectedResult.name}`)
            .join('\n') || '--';
    }

    public dataIsEmpty(data: any[]) {
        return data.length === 0;
    }

}

customElements.define(CpDetailsItem.is, CpDetailsItem);
