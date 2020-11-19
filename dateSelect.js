export class DateSelect {
    constructor() {

        this.dateSelectWrapper = document.createElement('div');
        this.dateSelectWrapper.className = 'select-wrapper';

        this.toggleUp = document.createElement('button');
        this.toggleUp.className = 'control up';

        this.toggleDown = document.createElement('button');
        this.toggleDown.className = 'control down';

        this.optionWrapper = document.createElement('div');
        this.optionWrapper.className = 'option-wrapper';

        this.dateSelectWrapper.appendChild(this.toggleUp);
        this.dateSelectWrapper.appendChild(this.optionWrapper);
        this.dateSelectWrapper.appendChild(this.toggleDown);

        this.date = new Date();
    }

    calculateDateOffset(dateArray, targetDate) {
        const dateArrayLength = dateArray.length;

        switch (true) {
            case (targetDate < dateArray[2]):
                return (dateArrayLength - dateArray[2]) + targetDate;
            case (targetDate === dateArray[2]):
                return 0;
            case (targetDate > dateArray[2]):
                return targetDate - dateArray[2];
            default:
                console.log('Error in MonthSelect calculateDateOffset');
                break;
        }
    }

    rotate(array, times) {
        while (times--) {
            let temp = array.shift();
            array.push(temp)
        }

        return array;
    }

    returnDateSelectWrapper() {
        return this.dateSelectWrapper;
    }

}

export class YearSelect extends DateSelect {
    constructor(givenYearRange) {
        super();
        this.dateSelectWrapper.className = 'select-wrapper year-select';
        this.yearArray = this.createYearRangeArray(givenYearRange);

        /* start Function */
        for (let i = 0; i < 5; i++) {

            const option = document.createElement('div');
            option.className = 'option option-' + i;
            option.innerHTML = this.yearArray[i];

            this.optionWrapper.appendChild(option);
        }

        /* downClick Function */
        this.toggleDown.addEventListener('click', buttonObject => {

            // update array order
            this.yearArray.push(this.yearArray.shift());

            for (let i = 0; i < 5; i++) {
                buttonObject.target.previousElementSibling.getElementsByClassName('option')[i].innerHTML = this.yearArray[i];
            }
        });

        /* upClick Function*/
        this.toggleUp.addEventListener('click', buttonObject => {
            //update array order
            this.yearArray.unshift(this.yearArray.pop());

            for (let i = 0; i < 5; i++) {
                buttonObject.target.nextElementSibling.getElementsByClassName('option')[i].innerHTML = this.yearArray[i];
            }
        });
    }

    toggleByInput(value) {

        // in case input is out of range
        if (value > Math.max(...this.yearArray)) {
            value = Math.max(...this.yearArray);
        }

        if (value !== this.yearArray[2] && value >= Math.min(...this.yearArray)) {
            let targetRotateCount = this.calculateDateOffset(this.yearArray, value);
            this.yearArray = this.rotate(this.yearArray, targetRotateCount);

            for (let i = 0; i < 5; i++) {
                this.optionWrapper.getElementsByClassName('option')[i].innerHTML = this.yearArray[i];
            }
        }
    }

    returnSelectedYear() {
        return this.yearArray[2];
    }

    returnOptionArray() {
        return this.yearArray;
    }

    createYearRangeArray(givenYearRange) {

        const yearRangeArray = [];
        const min = parseInt(givenYearRange[0]);
        const max = parseInt(givenYearRange[1]);

        for (let i = min; i <= max; ++i) {
            yearRangeArray.push(i);
        }

        if (yearRangeArray.length < 5) {
            const missingItems = 5 - yearRangeArray.length;

            for (let k = 0; k < missingItems; k++) {
                yearRangeArray.push(yearRangeArray[k]);
            }
        }

        return yearRangeArray;
    }
}

export class MonthSelect extends DateSelect {
    constructor(targetLocaleArray) {
        super();
        this.dateSelectWrapper.className = 'select-wrapper month-select';
        this.currentMonth = this.date.getMonth();

        this.monthArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        this.selectedLocaleArray = targetLocaleArray;

        this.monthStringArray = this.returnMonthStringArray(this.monthArray);

        /* start Function */
        for (let i = 0; i < 5; i++) {

            let option = document.createElement('div');
            option.className = 'option option-' + i;
            option.innerHTML = this.monthStringArray[i];

            this.optionWrapper.appendChild(option);
        }

        /* downClick Function */
        this.toggleDown.addEventListener('click', buttonObject => {
            // update array order
            this.monthArray.push(this.monthArray.shift());

            let monthStringArray = this.returnMonthStringArray(this.monthArray);

            for (let i = 0; i < 5; i++) {
                buttonObject.target.previousElementSibling.getElementsByClassName('option')[i].innerHTML = monthStringArray[i];
            }
        });

        /* upClick Function */
        this.toggleUp.addEventListener('click', buttonObject => {
            // update array order
            this.monthArray.unshift(this.monthArray.pop());

            let monthStringArray = this.returnMonthStringArray(this.monthArray);

            for (let i = 0; i < 5; i++) {
                buttonObject.target.nextElementSibling.getElementsByClassName('option')[i].innerHTML = monthStringArray[i];
            }
        });
    }

    returnMonthStringArray(monthArray) {

        let monthStringArray = [];
        let localeArray = this.selectedLocaleArray;

        if (!Array.isArray(monthArray)) {
            return this.selectedLocaleArray[monthArray];
        }

        monthArray.forEach(function (index) {

            monthStringArray.push(localeArray[index].substring(0, 3));
        });

        return monthStringArray;
    }

    toggleByInput(value) {

        if (value !== this.monthArray[2]) {
            this.monthArray = this.rotate(this.monthArray, this.calculateDateOffset(this.monthArray, value));
            this.monthStringArray = this.returnMonthStringArray(this.monthArray);

            for (let i = 0; i < 5; i++) {
                this.optionWrapper.getElementsByClassName('option')[i].innerHTML = this.monthStringArray[i];
            }
        }
    }

    toggleByMatrix(mode) {

        switch (mode) {
            case 'next':
                this.monthArray = this.rotate(this.monthArray, 1);
                break;
            case 'prev':
                this.monthArray = this.rotate(this.monthArray, 11);
                break;
            default:
                console.log('mode is not defined in toggleMonthByMatrix');
        }

        this.monthStringArray = this.returnMonthStringArray(this.monthArray);

        for (let i = 0; i < 5; i++) {
            this.optionWrapper.getElementsByClassName('option')[i].innerHTML = this.monthStringArray[i];
        }
    }

    returnSelectedMonthAsLabel() {
        return this.returnMonthStringArray(this.monthArray[2]);
    }

    returnSelectedMonth() {
        return this.monthArray[2];
    }

    returnOptionArray() {
        return this.monthArray;
    }
}
