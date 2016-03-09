import './nodep-date-input-polyfill.scss';

class Picker {
  constructor() {
    // This is a singleton.
    if(thePicker) {
      return thePicker;
    }

    this.date = new Date();
    this.input = null;
    this.isOpen = false;

    // The picker element. Unique tag name attempts to protect against
    // generic selectors.
    this.container = document.createElement(`date-input-polyfill`);

    // Add controls.
    // Year picker.
    this.year = Picker.createRangeSelect(
      this.date.getFullYear() - 80,
      this.date.getFullYear() + 20
    );
    this.year.className = `yearSelect`;
    this.year.addEventListener(`change`, ()=> {
      this.date.setYear(this.year.value);
      this.refreshDaysMatrix();
    });
    this.container.appendChild(this.year);

    // Month picker.
    const monthLabels = [
      `January`,
      `February`,
      `March`,
      `April`,
      `May`,
      `June`,
      `July`,
      `August`,
      `September`,
      `October`,
      `November`,
      `December`
    ];
    this.month = Picker.createRangeSelect(
      0,
      11,
      monthLabels
    );
    this.month.className = `monthSelect`;
    this.month.addEventListener(`change`, ()=> {
      this.date.setMonth(this.month.value);
      this.refreshDaysMatrix();
    });
    this.container.appendChild(this.month);

    // Today button.
    this.today = document.createElement(`button`);
    this.today.textContent = `Today`;
    this.today.addEventListener(`click`, ()=> {
      this.date = new Date();
      this.setInput();
    });
    this.container.appendChild(this.today);

    // Setup unchanging DOM for days matrix.
    const daysMatrix = document.createElement(`table`);
    const daysHead = document.createElement(`thead`);
    daysHead.innerHTML = `
      <thead>
        <tr>
          <th scope="col">Sun</th>
          <th scope="col">Mon</th>
          <th scope="col">Tue</th>
          <th scope="col">Wed</th>
          <th scope="col">Thu</th>
          <th scope="col">Fri</th>
          <th scope="col">Sat</th>
        </tr>
      </thead>
    `;

    this.days = document.createElement(`tbody`);

    // THIS IS THE BIG PART.
    // When the user clicks a day, set that day as the date.
    // Uses event delegation.
    this.days.addEventListener(`click`, e=> {
      const tgt = e.target;

      if(!tgt.hasAttribute(`data-day`)) {
        return false;
      }

      const curSel = this.days.querySelector(`[data-selected]`);
      if(curSel) {
        curSel.removeAttribute(`data-selected`);
      }
      tgt.setAttribute(`data-selected`, ``);

      this.date.setDate(parseInt(tgt.textContent));
      this.setInput();
    });

    daysMatrix.appendChild(daysHead);
    daysMatrix.appendChild(this.days);
    this.container.appendChild(daysMatrix);

    this.hide();
    document.body.appendChild(this.container);

    // Close the picker when clicking outside of a date input or picker.
    document.addEventListener(`click`, e=> {
      let el = e.target;
      let isPicker = el === this.container;

      while(!isPicker && (el = el.parentNode)) {
        isPicker = el === this.container;
      }

      e.target.getAttribute(`type`) !== `date` && !isPicker
        && this.hide();
    });
  }

  // Hide.
  hide() {
    this.container.setAttribute(`data-open`, this.isOpen = false);
  }

  // Show.
  show() {
    this.container.setAttribute(`data-open`, this.isOpen = true);
  }

  // Position picker below element. Align to element's left edge.
  goto(element) {
    const rekt = element.getBoundingClientRect();
    this.container.style.top = `${
      rekt.top + rekt.height
      + document.documentElement.scrollTop + document.body.scrollTop
    }px`;
    this.container.style.left = `${
      rekt.left
      + document.documentElement.scrollLeft + document.body.scrollLeft
    }px`;

    this.show();
  }

  // Initiate I/O with given date input.
  attachTo(input) {
    if(
      input === this.input
      && this.isOpen
    ) {
      return false;
    }

    this.input = input;
    this.sync();
    this.goto(this.input);
  }

  // Match picker date with input date.
  sync() {
    if(this.input.valueAsDate) {
      this.date = Input.absoluteDate(this.input.valueAsDate);
    } else {
      this.date = new Date();
    }

    this.year.value = this.date.getFullYear();
    this.month.value = this.date.getMonth();
    this.refreshDaysMatrix();
  }

  // Match input date with picker date.
  setInput() {
    this.input.valueAsDate = this.date;
    this.input.focus();
    this.hide();

    // Make AngularJS see the change.
    const fakeEvent = document.createEvent(`KeyboardEvent`);
    fakeEvent.initEvent(`change`, true, false);
    this.input.dispatchEvent(fakeEvent);
  }

  refreshDaysMatrix() {
    // Determine days for this month and year,
    // as well as on which weekdays they lie.
    const year = this.date.getFullYear(); // Get the year (2016).
    const month = this.date.getMonth(); // Get the month number (0-11).
    const startDay = new Date(year, month, 1).getDay(); // First weekday of month (0-6).
    const maxDays = new Date(
      this.date.getFullYear(),
      month + 1,
      0
    ).getDate(); // Get days in month (1-31).

    // The input's current date.
    const selDate = Input.absoluteDate(this.input.valueAsDate) || this.date;

    // Are we in the input's currently-selected month and year?
    // Or just browsing?
    const selMatrix =
      year === selDate.getFullYear()
      && month === selDate.getMonth();

    // Populate days matrix.
    let matrixHTML = [];
    for(let i = 0; i < maxDays + startDay; ++i) {
      // Add a row every 7 days.
      if(i % 7 === 0) {
        matrixHTML.push(`
          ${i !== 0 ? `</tr>` : ``}
          <tr>
        `);
      }

      // Add new column.
      // If no days from this month in this column, it will be empty.
      if(i + 1 <= startDay) {
        matrixHTML.push(`<td></td>`);
        continue;
      }

      // Populate day number.
      const dayNum = i + 1 - startDay;
      const selected = selMatrix && selDate.getDate() === dayNum;

      matrixHTML.push(
        `<td data-day ${selected ? `data-selected` : ``}>
          ${dayNum}
        </td>`
      );
    }

    this.days.innerHTML = matrixHTML.join(``);
  }

  static createRangeSelect(min, max, namesArray) {
    const theSelect = document.createElement(`select`);

    for(let i = min; i <= max; ++i) {
      const aOption = document.createElement(`option`);
      theSelect.appendChild(aOption);

      const theText = namesArray ? namesArray[i - min] : i;

      aOption.text = theText;
      aOption.value = i;
    };

    return theSelect;
  }
}

const thePicker = new Picker();

class Input {
  constructor(input) {
    this.element = input;
    this.element.setAttribute(`data-has-picker`, ``);

    Object.defineProperties(
      this.element,
      {
        'valueAsDate': {
          get: ()=> {
            if(!this.element.value) {
              return null;
            }

            const val = this.element.value.split(/\D/);
            return new Date(`${val[0]}-${`0${val[1]}`.slice(-2)}-${`0${val[2]}`.slice(-2)}`);
          },
          set: val=> {
            this.element.value = val.toISOString().slice(0,10);
          }
        },
        'valueAsNumber': {
          get: ()=> {
            if(!this.element.value) {
              return NaN;
            }

            return this.element.valueAsDate.getTime();
          },
          set: val=> {
            this.element.valueAsDate = new Date(val);
          }
        }
      }
    );

    // Open the picker when the input get focus,
    // also on various click events to capture it in all corner cases.
    const showPicker = ()=> {
      thePicker.attachTo(this.element);
    };
    this.element.addEventListener(`focus`, showPicker);
    this.element.addEventListener(`mousedown`, showPicker);
    this.element.addEventListener(`mouseup`, showPicker);

    // Update the picker if the date changed manually in the input.
    this.element.addEventListener(`keyup`, ()=> {
      thePicker.sync();
    });
  }

  // Return false if the browser does not support input[type="date"].
  static supportsDateInput() {
    const input = document.createElement(`input`);
    input.setAttribute(`type`, `date`);

    const notADateValue = `not-a-date`;
    input.setAttribute(`value`, notADateValue);

    return !(input.value === notADateValue);
  }

  // Will add the Picker to all inputs in the page.
  static addPickerToDateInputs() {
    // Get and loop all the input[type="date"]s in the page that do not have `[data-has-picker]` yet.
    const dateInputs = document.querySelectorAll(`input[type="date"]:not([data-has-picker])`);
    const length = dateInputs.length;

    if(!length) {
      return false;
    }

    for(let i = 0; i < length; ++i) {
      new Input(dateInputs[i]);
    }
  }

  static absoluteDate(date) {
    return date && new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
  }
}

// Run the above code on any <input type="date"> in the document, also on dynamically created ones.
// Check if type="date" is supported.
if(!Input.supportsDateInput()) {
  Input.addPickerToDateInputs();

  document.addEventListener(`DOMContentLoaded`, ()=> {
    Input.addPickerToDateInputs();
  });
  // This is also on mousedown event so it will capture new inputs that might
  // be added to the DOM dynamically.
  document.querySelector(`body`).addEventListener(`mousedown`, ()=> {
    Input.addPickerToDateInputs();
  });
}
