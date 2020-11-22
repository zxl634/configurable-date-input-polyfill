import { YearSelect, MonthSelect } from './dateSelect';

class Picker {
    constructor() {
        // This is a singleton.
        if (window.thePicker) {
            return window.thePicker;
        }

        // The picker element. Unique tag name attempts to protect against
        // generic selectors.
        this.container = document.createElement('date-input-polyfill');
        this.container.className = 'date-input-polyfill';
        this.date = new Date();
        this.input = null;
        this.isOpen = false;

        // Add controls.

        // DateSelect Header
        const dateSelectHeader = document.createElement('div');
        dateSelectHeader.className = 'date-select-header';

        const dateHeaderButton = document.createElement('button');
        dateHeaderButton.className = 'date-header-button date-header-button-inactive';
        dateHeaderButton.addEventListener('click', () => {
            if (dateHeaderButton.classList.contains('date-header-button-inactive')) {
                dateHeaderButton.classList.add('date-header-button-active');
                dateHeaderButton.classList.remove('date-header-button-inactive');
                dateSelectWrapper.style.display = 'block';
            } else if (dateHeaderButton.classList.contains('date-header-button-active')) {
                dateHeaderButton.classList.add('date-header-button-inactive');
                dateHeaderButton.classList.remove('date-header-button-active');
                dateSelectWrapper.style.display = 'none';

                // Refresh dayMatrix here cause performance
                this.date.setMonth(this.monthSelect.returnSelectedMonth());
                this.date.setFullYear(this.yearSelect.returnSelectedYear());
                this.refreshDaysMatrix();
            }
        });

        dateSelectHeader.appendChild(dateHeaderButton);

        this.container.appendChild(dateSelectHeader);

        const dayMatrixWrapper = document.createElement('div');
        dayMatrixWrapper.className = 'day-matrix-wrapper';
        this.container.appendChild(dayMatrixWrapper);

        const dateSelectWrapper = document.createElement('div');
        this.dateSelectWrapper = dateSelectWrapper;
        dateSelectWrapper.className = 'date-select-dropdown';

        this.selectWrapper = document.createElement('div');
        this.selectWrapper.className = 'select-container';
        dateSelectWrapper.appendChild(this.selectWrapper);

        this.monthSelect = document.createElement('div');
        this.monthSelect.className = 'select-wrapper month-select';
        this.selectWrapper.appendChild(this.monthSelect);

        this.yearSelect = document.createElement('div');
        this.yearSelect.className = 'select-wrapper year-select';
        this.selectWrapper.appendChild(this.yearSelect);

        this.container.appendChild(dateSelectWrapper);

        // Setup unchanging DOM for days matrix.
        const daysMatrix = document.createElement('table');
        this.daysHead = document.createElement('thead');
        this.days = document.createElement('tbody');

        // Click event to set that day as the date.
        // Uses event delegation.
        this.days.addEventListener('click', (e) => {
            const targetDay = e.target;
            const currentSelected = this.days.querySelector('[data-selected]');
            if (currentSelected) {
                currentSelected.removeAttribute('data-selected');
            }
            targetDay.setAttribute('data-selected', '');

            // Checks for next or prev month
            let jumpMonth = false;
            if (targetDay.classList.contains('next-month')) {
                if (this.monthSelect.returnSelectedMonth() === 11) {
                    this.yearSelect.toggleByInput(this.yearSelect.returnSelectedYear() + 1);
                }

                this.monthSelect.toggleByMatrix('next');

                jumpMonth = true;
            } else if (targetDay.classList.contains('prev-month')) {
                if (this.monthSelect.returnSelectedMonth() === 0) {
                    this.yearSelect.toggleByInput(this.yearSelect.returnSelectedYear() - 1);
                }

                this.monthSelect.toggleByMatrix('prev');

                jumpMonth = true;
            }

            // Updates if jump is detected
            if (jumpMonth) {
                this.date.setMonth(this.monthSelect.returnSelectedMonth());
                this.date.setYear(this.yearSelect.returnSelectedYear());
                dateHeaderButton.innerHTML = `${this.monthSelect.returnSelectedMonthAsLabel()} ${this.yearSelect.returnSelectedYear()}`;
            }

            this.date.setDate(parseInt(targetDay.textContent));
            this.setInput();
        });

        daysMatrix.appendChild(this.daysHead);
        daysMatrix.appendChild(this.days);
        dayMatrixWrapper.appendChild(daysMatrix);

        this.hide();
        document.body.appendChild(this.container);

        this.removeClickOut = (e) => {
            if (this.isOpen) {
                let el = e.target;
                let isPicker = el === this.container || el === this.input;
                while (!isPicker && (el = el.parentNode)) {
                    isPicker = el === this.container;
                }
                ((e.target.getAttribute('type') !== 'date' && !isPicker) || !isPicker)
                    && this.hide();
            }
        };
    }

    // Position picker below element. Align to element's right edge.
    // TODO rebuild
    positionPicker(element) {
        const rekt = element.getBoundingClientRect();
        this.container.style.top = `${rekt.top + rekt.height
            + (document.documentElement.scrollTop || document.body.scrollTop)
            + 3
            }px`;

        const contRekt = this.container.getBoundingClientRect();
        const width = contRekt.width ? contRekt.width : 280;

        const classWithOutPos = () => {
            return this.container.className
                .replace('polyfill-left-aligned', '')
                .replace('polyfill-right-aligned', '')
                .replace(/\s+/g, ' ').trim();
        };

        let base = rekt.right - width;
        if (rekt.right < width) {
            base = rekt.left;
            this.container.className = `${classWithOutPos()} polyfill-left-aligned`;
        } else {
            this.container.className = `${classWithOutPos()} polyfill-right-aligned`;
        }
        this.container.style.left = `${base
            + (document.documentElement.scrollLeft || document.body.scrollLeft)
            }px`;
        this.show();
    }

    // Initiate I/O with given date input.
    attachTo(input) {
        if (input === this.input && this.isOpen) {
            return false;
        }

        this.input = input;

        this.syncPickerWithInput();
        this.positionPicker(this.input);
        return true;
    }

    // Hide.
    hide() {
        this.container.setAttribute('data-open', this.isOpen = false);

        this.container.getElementsByClassName('date-header-button')[0].className = 'date-header-button date-header-button-inactive';

        // Close the picker when clicking outside of a date input or picker.
        if (this.input) {
            this.dateSelectWrapper.style.display = 'none';
            this.input.blur();
        }
        document.removeEventListener('mousedown', this.removeClickOut);
        document.removeEventListener('touchstart', this.removeClickOut);
    }

    // Show.
    show() {
        this.container.setAttribute('data-open', this.isOpen = true);
        // Close the picker when clicking outside of a date input or picker.
        setTimeout(() => {
            document.addEventListener('mousedown', this.removeClickOut);
            document.addEventListener('touchstart', this.removeClickOut);
        }, 500);

        // when used in a single-page app  or otherwise,
        // hide datepicker when the browser's back button is pressed
        window.onpopstate = () => {
            this.hide();
        };
    }

    // Match picker date with input date.
    syncPickerWithInput() {
        // fixes bug where an empty calendar appears if year is missing from keyboard input
        if (!isNaN(Date.parse(this.input.valueAsDate))) {
            this.date = Picker.absoluteDate(this.input.valueAsDate);
        } else {
            this.date = new Date();
        }

        // set matrix header and locale
        this.createMatrixHeader();

        // create year select by given values
        this.selectWrapper.removeChild(this.selectWrapper.getElementsByClassName('select-wrapper year-select')[0]);
        this.yearSelect = new YearSelect(this.input.yearRange);

        this.selectWrapper.insertBefore(this.yearSelect.returnDateSelectWrapper(), this.selectWrapper.firstChild);

        // create month select by given language
        this.selectWrapper.removeChild(this.selectWrapper.getElementsByClassName('select-wrapper month-select')[0]);
        this.monthSelect = new MonthSelect(this.locale.months);

        this.selectWrapper.insertBefore(this.monthSelect.returnDateSelectWrapper(), this.selectWrapper.firstChild);

        const minRange = parseInt(this.input.yearRange[0]);
        const maxRange = parseInt(this.input.yearRange[1]);

        // if current year is in selection range
        if (this.date.getFullYear() <= maxRange && this.date.getFullYear() >= minRange) {
            this.monthSelect.toggleByInput(this.date.getMonth());
            this.yearSelect.toggleByInput(this.date.getFullYear());
        } else {
            const currentDate = new Date();
            // check if default year needs to be calculated
            if (currentDate.getFullYear() <= maxRange && currentDate.getFullYear() >= minRange) {
                this.date.setFullYear(currentDate.getFullYear());
            } else {
                const defaultYearValueOfGivenRange = minRange + (Math.round(maxRange - minRange) / 2);
                this.date.setFullYear(defaultYearValueOfGivenRange);
            }

            this.monthSelect.toggleByInput(this.date.getMonth());
            this.yearSelect.toggleByInput(this.date.getFullYear());
        }

        // Setup click events for the selection Button
        const selectDateButton = document.getElementsByClassName('date-header-button')[0];

        selectDateButton.innerHTML = `${this.monthSelect.returnSelectedMonthAsLabel()} ${this.yearSelect.returnSelectedYear()}`;

        const dateSelectControlls = this.selectWrapper.getElementsByClassName('control');

        for (let i = 0; i < dateSelectControlls.length; i += 1) {
            dateSelectControlls[i].addEventListener('click', () => {
                selectDateButton.innerHTML = `${this.monthSelect.returnSelectedMonthAsLabel()} ${this.yearSelect.returnSelectedYear()}`;
            });
        }

        this.refreshDaysMatrix();
    }

    // Match input date with picker date.
    setInput() {
        this.input.valueAsDate = this.date;
        this.input.focus();
        setTimeout(() => { // IE wouldn't hide, so in a timeout you go.
            this.hide();
        }, 100);
    }

    createMatrixHeader() {
        if (this.locale === this.input.locale && this.firstDayOfWeek === this.input.firstDayOfWeek) {
            return false;
        }

        this.locale = this.input.locale;
        this.firstDayOfWeek = this.input.firstDayOfWeek;

        const daysHeaderContent = [];

        for (let i = 0, len = this.locale.days.length; i < len; i += 1) {
            daysHeaderContent.push(`<th scope="col">${this.locale.days[i]}</th>`);
        }

        // check if first day of week is monday
        if (this.input.firstDayOfWeek === 'mo') {
            daysHeaderContent.push(daysHeaderContent.shift());
        }
        // check if first day of week is saturday
        if (this.input.firstDayOfWeek === 'sa') {
            daysHeaderContent.unshift(daysHeaderContent.pop());
        }

        this.daysHead.innerHTML = `<tr> ${daysHeaderContent.join('')} </tr>`;
    }

    refreshDaysMatrix() {
        // Determine days for this month and year,
        // as well as on which weekdays they lie.
        const year = this.date.getFullYear(); // Get the year (2016).
        const month = this.date.getMonth(); // Get the month number (0-11).
        const oldDaysInCurrentMonth = [];

        let startDay = new Date(year, month, 1).getDay(); // First weekday of month (0-6).
        const maxDays = new Date(
            this.date.getFullYear(),
            month + 1,
            0,
        ).getDate(); // Get days in month (1-31).

        // check if first day of week is monday
        if (this.input.firstDayOfWeek === 'mo') {
            // update startDay to EU format -> start at mo
            if (startDay === 0) {
                startDay = 6;
            } else {
                startDay -= 1;
            }
        }
        // check if first day of week is saturday
        if (this.input.firstDayOfWeek === 'sa') {
            // update startDay to EU format -> start at mo
            if (startDay === 6) {
                startDay = 0;
            } else {
                startDay += 1;
            }
        }

        // adds days of the last month if this month dont start at 0
        if (startDay > 0) {
            const daysOfLastMonth = new Date(year, month, 0).getDate(); // Get days in month (1-31).

            const daysToCollect = startDay;
            let dayPosition = daysToCollect - 1;

            for (let i = 0; i < daysToCollect; i += 1) {
                oldDaysInCurrentMonth.push(daysOfLastMonth - dayPosition);
                dayPosition -= 1;
            }
        }

        // The input's current date.
        const selDate = Picker.absoluteDate(this.input.valueAsDate) || false;

        // Are we in the input's currently-selected month and year?
        const selMatrix = selDate
            && year === selDate.getFullYear()
            && month === selDate.getMonth();

        // Populate days matrix.
        const matrixHTML = [];

        // check if its the current month were looking at
        const today = new Date();
        let lookingAtCurrentMonth = false;
        if (this.date.getFullYear() === today.getFullYear()) {
            if (this.date.getMonth() === today.getMonth()) {
                lookingAtCurrentMonth = true;
            }
        }

        for (let i = 0; i < maxDays + startDay; i += 1) {
            // Add a row every 7 days.
            if (i % 7 === 0) {
                matrixHTML.push(`${i !== 0 ? `</tr>` : ``}<tr>`);
            }

            // Add new column.
            // If no days from this month in this column, it will be empty.
            if (i + 1 <= startDay) {
                matrixHTML.push('<td class="prev-month">' + oldDaysInCurrentMonth[i] + '</td>');
                continue;
            }

            // Populate day number.
            const dayNum = i + 1 - startDay;
            const selected = selMatrix && selDate.getDate() === dayNum;

            // check if current item is current day            
            if (lookingAtCurrentMonth && today.getDate() === dayNum) {
                // highlight the current day
                matrixHTML.push(
                    `<td data-day ${selected ? `data-selected` : ``} class='current-day'>${dayNum}</td>`
                );
            } else {
                // display normal
                matrixHTML.push(
                    `<td data-day ${selected ? `data-selected` : ``}>${dayNum}</td>`
                );
            }
        }

        // fill remaining space with next Month items
        if (startDay + maxDays < 42) {
            let remainingSpace = 42 - (startDay + maxDays);
            let nextMonthDaysValue = 0;

            const currentDisplayedDays = startDay + maxDays;
            const currentRows = (startDay + maxDays) / 7;

            if (currentRows <= 4) {
                for (let i = 0; i < remainingSpace; i += 1) {
                    // Add a row every 7 days.
                    if (i % 7 === 0) {
                        matrixHTML.push(`${i !== 0 ? `</tr>` : ``}<tr>`);
                    }
                    
                    matrixHTML.push(`<td class="next-month"> ${i + 1} </td>`);
                }
            }

            if (currentRows <= 5 && currentRows > 4) {

                // fill last items of existent row
                if (currentDisplayedDays < 35) {
                    const existentRowSpace = 35 - currentDisplayedDays;
                    for (let i = 0; i < existentRowSpace; i += 1) {
                        matrixHTML.push(`<td class="next-month"> ${i + 1} </td>`);
                    }
                    remainingSpace = remainingSpace - existentRowSpace;
                    nextMonthDaysValue = existentRowSpace;
                }

                matrixHTML.push('<tr>');

                for (let i = 0; i < remainingSpace; i += 1) {
                    if (nextMonthDaysValue > 0) {
                        const itemLabel = nextMonthDaysValue + (i + 1);
                        matrixHTML.push(`<td class="next-month"> ${itemLabel} </td>`);
                    } else {
                        matrixHTML.push(`<td class="next-month"> ${i + 1} </td>`);
                    }
                }

                matrixHTML.push('</tr>');
            }

            if (currentRows > 5) {
                for (let i = 0; i < remainingSpace; i += 1) {
                    matrixHTML.push(`<td class="next-month"> ${i + 1} </td>`);
                }
            }
        }

        this.days.innerHTML = matrixHTML.join('');
    }

    returnCurrentDate() {
        return this.date;
    }

    static absoluteDate(date) {
        return date && new Date(date.getTime());
    }
}

window.thePicker = new Picker();

export default window.thePicker;
