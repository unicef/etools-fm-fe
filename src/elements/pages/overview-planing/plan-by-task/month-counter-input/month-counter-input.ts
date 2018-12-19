type NullOrNumber = null | number;
import { months } from '../../../../common-elements/month-list';

class MonthCounterInput extends Polymer.Element {
    private count!: number[];
    public static get is() { return 'month-counter-input'; }

    public static get properties() {
        return {
            year: {
                type: Number,
                value: 0
            },
            months: {
                type: Array,
                value: () => months
            },
            count: {
                type: Array,
                value: () => [],
            },
            readonly: {
                type: Boolean,
                value: false,
                observer: 'updateStyles'
            }
        };
    }

    public getMonthName(month: string, lettersCount = month.length): string {
        return month.slice(0, lettersCount);
    }

    public getCountForMonth(countArray: number[], index: number): NullOrNumber {
        const count = (countArray || [])[index];
        return isNaN(count) ? 0 : count;
    }

    public onCountChange({target}: KeyboardEvent) {
        const index = R.path(['dataset', 'index'], target);
        const value = R.pathOr(0, ['value'], target);

        if (value !== `${+value}`) {
            R.set(R.lensProp('value'), +value || 0, target);
        }

        if (!isNaN(index)) {
            this.count[index] = +value || 0;
        }
    }

    public isReadonly(readonly: boolean, month: number, year: number) {
        if (readonly || isNaN(+month) || !year) { return true; }
        const date = new Date(+year, +month + 4);
        return new Date().getTime() >= date.getTime();
    }
}

customElements.define(MonthCounterInput.is, MonthCounterInput);
