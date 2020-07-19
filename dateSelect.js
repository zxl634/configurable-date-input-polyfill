export default class DateSelect {

    static createMonthSelect(targetLocale) {
        this.monthSelect = new MonthSelect(targetLocale);
        this.monthSelectHtml = this.monthSelect.returnMonthSelectWrapper();
        return this.monthSelectHtml;
    }

    static createYearSelect(yearRange) {
        this.yearSelect = new YearSelect(yearRange);
        this.yearSelectHtml = this.yearSelect.returnYearSelectWrapper();
        return this.yearSelectHtml;
    }

    static setDateSelect(date) {
        this.monthSelect.toggleByInput(date.getMonth());
        this.yearSelect.toggleByInput(date.getFullYear());
    }

    static returnCurrentSelection() {
        return this.monthSelect.returnSelectedMonthAsLabel() + ' ' + this.yearSelect.returnSelectedYear()
    }

    static returnSelectedMonth() {
        return this.monthSelect.returnSelectedMonth();
    }

    static returnSelectedYear() {
        return this.yearSelect.returnSelectedYear();
    }

    static toggleMonthByMatrix(mode) {
        if (mode === "next" && this.monthSelect.returnSelectedMonth() === 11) {
            this.yearSelect.toggleByInput(this.yearSelect.returnSelectedYear() + 1);
        }

        if (mode === "prev" && this.monthSelect.returnSelectedMonth() === 0) {
            this.yearSelect.toggleByInput(this.yearSelect.returnSelectedYear() - 1);
        }

        this.monthSelect.toggleByMatrix(mode);
    }
}


function YearSelect(givenYearRange) {
    this.yearSelectWrapper = document.createElement('div');
    this.yearSelectWrapper.className = "select-wrapper year-select";

    this.toggleUp = document.createElement('button');
    this.toggleUp.className = "control up";

    this.toggleDown = document.createElement('button');
    this.toggleDown.className = "control down";

    this.optionWrapper = document.createElement('div');
    this.optionWrapper.className = "option-wrapper";

    this.yearSelectWrapper.appendChild(this.toggleUp);
    this.yearSelectWrapper.appendChild(this.optionWrapper);
    this.yearSelectWrapper.appendChild(this.toggleDown);

    this.date = new Date();

    this.calculateTargetYearOffset = function (yearRangeArray, targetYear) {
        var yearRangeArrayLength = yearRangeArray.length;

        switch (true) {
            case (targetYear < yearRangeArray[2]):
                return (yearRangeArrayLength - yearRangeArray[2]) + targetYear;
            case (targetYear === yearRangeArray[2]):
                return 0;
            case (targetYear > yearRangeArray[2]):
                return targetYear - yearRangeArray[2];
            default:
                console.log('Error in YearSelect calculateTargetOffset');
                break;
        }
    };

    this.rotate = function (array, times) {
        while (times--) {
            var temp = array.shift();
            array.push(temp)
        }

        return array;
    };

    this.toggleByInput = function (value) {

        //in case input is out of range
        if (value > Math.max(...yearArray)) {
            value = Math.max(...yearArray);
        }

        if (value !== yearArray[2] && value >= Math.min(...yearArray)) {
            let targetRotateCount = this.calculateTargetYearOffset(yearArray, value);
            yearArray = this.rotate(yearArray, targetRotateCount);

            for (let i = 0; i < 5; i++) {
                this.optionWrapper.getElementsByClassName('option')[i].innerHTML = yearArray[i];
            }
        }
    };

    this.returnYearSelectWrapper = function () {
        return this.yearSelectWrapper;
    };

    this.returnSelectedYear = function () {
        return yearArray[2];
    };

    this.returnOptionArray = function () {
        return yearArray;
    };

    let yearArray = createYearRangeArray(givenYearRange);

    /* start Function */
    for (let i = 0; i < 5; i++) {

        let option = document.createElement('div');
        option.className = "option option-" + i;
        option.innerHTML = yearArray[i];

        this.optionWrapper.appendChild(option);
    }

    /* downClick Function*/
    this.toggleDown.addEventListener('click', function () {
        //update array order
        yearArray.push(yearArray.shift());

        for (let i = 0; i < 5; i++) {
            this.previousElementSibling.getElementsByClassName('option')[i].innerHTML = yearArray[i];
        }
    });

    /* upClick Function*/
    this.toggleUp.addEventListener('click', function () {
        //update array order
        yearArray.unshift(yearArray.pop());

        for (let i = 0; i < 5; i++) {
            this.nextElementSibling.getElementsByClassName('option')[i].innerHTML = yearArray[i];
        }
    });


    function createYearRangeArray(givenYearRange) {

        let yearRangeArray = [];
        let min = parseInt(givenYearRange[0]);
        let max = parseInt(givenYearRange[1]);

        for (let i = min; i <= max; ++i) {
            yearRangeArray.push(i);
        }

        if (yearRangeArray.length < 5) {
            let missingItems = 5 - yearRangeArray.length;

            for (let k = 0; k < missingItems; k++) {
                yearRangeArray.push(yearRangeArray[k]);
            }
        }

        return yearRangeArray;
    }
}

function MonthSelect(targetLocaleArray) {

    this.monthSelectWrapper = document.createElement('div');
    this.monthSelectWrapper.className = "select-wrapper month-select";

    this.toggleUp = document.createElement('button');
    this.toggleUp.className = "control up";

    this.toggleDown = document.createElement('button');
    this.toggleDown.className = "control down";

    this.optionWrapper = document.createElement('div');
    this.optionWrapper.classList.add("option-wrapper");

    this.monthSelectWrapper.appendChild(this.toggleUp);
    this.monthSelectWrapper.appendChild(this.optionWrapper);
    this.monthSelectWrapper.appendChild(this.toggleDown);

    this.date = new Date();
    this.currentMonth = this.date.getMonth();

    this.calculateMonthOffset = function (monthArray, targetMonth) {
        let monthArrayLength = monthArray.length;

        switch (true) {
            case (targetMonth < monthArray[2]):
                return (monthArrayLength - monthArray[2]) + targetMonth;
            case (targetMonth === monthArray[2]):
                return 0;
            case (targetMonth > monthArray[2]):
                return targetMonth - monthArray[2];
            default:
                console.log('Error in MonthSelect calculateTargetOffset');
                break;
        }
    };

    this.returnMonthStringArray = function (monthArray) {

        let monthStringArray = [];

        if (!Array.isArray(monthArray)) {
            return targetLocaleArray[monthArray];
        }

        monthArray.forEach(function (index) {

            monthStringArray.push(targetLocaleArray[index].substring(0, 3));
        });

        return monthStringArray;
    };

    this.toggleByInput = function (value) {

        if (value !== monthArray[2]) {
            monthArray = this.rotate(monthArray, this.calculateMonthOffset(monthArray, value));
            monthStringArray = this.returnMonthStringArray(monthArray);

            for (let i = 0; i < 5; i++) {
                this.optionWrapper.getElementsByClassName('option')[i].innerHTML = monthStringArray[i];
            }
        }
    };

    this.toggleByMatrix = function (mode) {

        switch (mode) {
            case 'next':
                monthArray = this.rotate(monthArray, 1);
                break;
            case 'prev':
                monthArray = this.rotate(monthArray, 11);
                break;
            default:
                console.log('mode is not defined in toggleMonthByMatrix');
        }

        monthStringArray = this.returnMonthStringArray(monthArray);

        for (let i = 0; i < 5; i++) {
            this.optionWrapper.getElementsByClassName('option')[i].innerHTML = monthStringArray[i];
        }
    };

    this.rotate = function (array, times) {
        while (times--) {
            let temp = array.shift();
            array.push(temp)
        }

        return array;
    };

    this.returnMonthSelectWrapper = function () {
        return this.monthSelectWrapper;
    };

    this.returnSelectedMonthAsLabel = function () {
        return this.returnMonthStringArray(monthArray[2]);
    };

    this.returnSelectedMonth = function () {
        return monthArray[2];
    };

    this.returnOptionArray = function () {
        return monthArray;
    };

    let monthArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    let monthStringArray = this.returnMonthStringArray(monthArray);

    /* start Function */
    for (let i = 0; i < 5; i++) {

        let option = document.createElement('div');
        option.className = "option option-" + i;
        option.innerHTML = monthStringArray[i];

        this.optionWrapper.appendChild(option);
    }

    /* downClick Function*/
    this.toggleDown.addEventListener(`click`, buttonObject => {
        //update array order
        monthArray.push(monthArray.shift());

        let monthStringArray = this.returnMonthStringArray(monthArray);

        for (let i = 0; i < 5; i++) {
            buttonObject.target.previousElementSibling.getElementsByClassName('option')[i].innerHTML = monthStringArray[i];
        }
    });

    /* upClick Function*/
    this.toggleUp.addEventListener(`click`, buttonObject => {
        //update array order
        monthArray.unshift(monthArray.pop());

        let monthStringArray = this.returnMonthStringArray(monthArray);

        for (let i = 0; i < 5; i++) {
            buttonObject.target.nextElementSibling.getElementsByClassName('option')[i].innerHTML = monthStringArray[i];
        }
    });
}