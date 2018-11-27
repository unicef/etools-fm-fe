type NullOrNumber = null | number;

class MonthCounter extends Polymer.Element {
    public static get is() { return 'month-counter'; }

    public static get properties() {
        return {
            months: {
                type: Array,
                value: () => ['January', 'February', 'March',
                    'April', 'May', 'June',
                    'July', 'August', 'September',
                    'October', 'November', 'December']
            },
            showTitles: Boolean,
            count: {
                type: Array,
                value: () => []
            }
        };
    }

    public getMonthName(month: string, lettersCount = month.length): string {
        return month.slice(0, lettersCount);
    }

    public getCountForMonth(countArray: number[], index: number): NullOrNumber {
        const count = countArray[index];
        return isNaN(count) ? null : count;
    }
}

customElements.define(MonthCounter.is, MonthCounter);
