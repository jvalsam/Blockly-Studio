let calendar,
  organizer,
  calendarData = {},
  devicesOnAutomations,
  testsCounter = 1;

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

const InitDevice = function (smartDevice) {
  return {
    id: smartDevice.editorsData[0].generated.details.iotivityResourceID,
    editorId: smartDevice.editorsData[0].generated.editorId,
    name: smartDevice.title,
    options: {
      image: smartDevice.img,
    },
    properties: smartDevice.editorsData[0].generated.details.properties,
    actions: smartDevice.editorsData[0].generated.details.actions,
    blocklyEditorId:
      smartDevice.editorsData[0].generated.details.blocklyEditorId,
    blocklyEditorDataIndex:
      smartDevice.editorsData[0].generated.details.blocklyEditorDataIndex,
  };
};

const CollectRegisteredDevices = function (smartDevices) {
  const returnArray = [];

  smartDevices.forEach((so) => {
    // for registered devices
    returnArray.push(InitDevice(so));
  });

  return returnArray;
};

const Initialize = function (selector, runTimeData) {
  // install utc plugin for dayjs
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_customParseFormat);
  InitializeSimulatedTime();

  let modalContainer = document.createElement("div");
  modalContainer.id = "modal-container";
  selector.appendChild(modalContainer);

  InitializeCalendar(selector);
  InitializeOrganizerForCalendar();
  InitializeActionsLog();
  InitializeSimulatedHistory(runTimeData);
  InitializeClocks(document.getElementById("calendar-outer"), () => {
    // hack to live update the completed events:
    // bind an observer to seconds of utility clock
    const observeChangesOfUtilityClockCSS = new MutationObserver(function () {
      UpdateUIForCompletedEventsInCalendar();
    });

    let target = document.getElementById("anchor-second");
    observeChangesOfUtilityClockCSS.observe(target, {
      attributes: true,
      attributeFilter: ["style"],
    });
  });
  InitializeSimulatorControls({
    dom: document.getElementById("clocks-controls-outer"),
    onNormalSpeed: () => {
      PauseSimulatedTime();
      NormalSimulatedTime();
    },
    onPauseTime: () => {
      PauseSimulatedTime();
    },
    onBackward: () => {
      if (timeSpeedMultiplier > 0.25) {
        timeSpeedMultiplier = timeSpeedMultiplier - 0.25;
        nowTimeSpeed = timeSpeedInSpeedUp / timeSpeedMultiplier;
      }
      PauseSimulatedTime();
      if (timeSpeedMultiplier === 1) NormalSimulatedTime();
      else SpeedUpSimulatedTime();
    },
    onSpeedUpTime: () => {
      if (timeSpeedMultiplier < 8) {
        timeSpeedMultiplier = timeSpeedMultiplier + 0.25;
        nowTimeSpeed = timeSpeedInSpeedUp / timeSpeedMultiplier;
      }
      PauseSimulatedTime();
      if (timeSpeedMultiplier === 1) NormalSimulatedTime();
      else SpeedUpSimulatedTime();
    },
    onGoToSpecificTime: (onSuccessGoTo) => {
      let day = document.getElementById("specific-date-input").value;
      let time = document.getElementById("specific-time-input").value;
      let dateString = day + "-" + time;
      let specificDate = dayjs(dateString, "YYYY-MM-DD-HH:mm:ss", true);
      if (specificDate.diff(simulatedTime) < -1000) {
        // TODO: cannot go to past time
        return;
      } else if (
        simulatedTimeTable[0] &&
        specificDate.diff(simulatedTimeTable[0].time) < 0
      ) {
      } else {
        document
          .getElementById("time-speed-title")
          .style.setProperty("display", "none");

        document.getElementById("time-speed-info").innerHTML =
          "Go to: " + specificDate;

        let i = 0;
        // jump to specific date but with simulatedTimeTable
        while (i < simulatedTimeTable.length) {
          if (specificDate.diff(simulatedTimeTable[i].time) > 0) {
            clearInterval(simulatedTimeTable[i].intervalFunc);
            simulatedTime = simulatedTimeTable[i].time;
            simulatedTimeTable[i].func();
          } else {
            break;
          }
          i++;
        }
      }
      simulatedTime = specificDate;
      // NormalSimulatedTime();
      onSuccessGoTo();
    },
  });
  InitializeSmartDevicesContainer(selector);
};

/* Start data and functions for calendar - conditional blocks */
const timeIdsToDate = {}; //  <id>: { day: "December 14, 2020", startTime: "16:54:33" }
const activeDateOnCalendar = {}; // "December 14, 2020": [ {startTime:"16:54:33", endTime: "" id: <id>, isFired: false, isCompleted = true } ]

const arrayIntervals = []; // {type: <blockType>, time: SetTimeout, endTime: Time, func: Function (for recursive)}

const whenCondData = [];

const changesData = [];

const TriggerWhenConditionalsFunctions = function () {
  whenCondData.forEach((cond) => {
    cond.func();
  });
};

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TakeDifferenceFromSpecificTime = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let futureTime = dayjs(simulatedTime)
    .set("second", time.second)
    .set("minute", time.minute)
    .set("hour", time.hour);

  let ms = futureTime.diff(simulatedTime);

  if (ms <= 0) {
    futureTime = dayjs(simulatedTime)
      .set("second", time.second)
      .set("minute", time.minute)
      .set("hour", time.hour)
      .set("day", simulatedTime.day() + 1);
  }

  // Pin in calendar
  PinEventInCalendar(
    futureTime,
    calendarInfo,
    calendarBlockId,
    intervalCheckForTime
  );

  AddTimeInSimulatedTable(futureTime, calendarBlockId, func);

  return futureTime;
};

const TakeDifferenceFromSpecificDay = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let intDay = weekDays.indexOf(time.day);

  let futureDate = dayjs(simulatedTime).day(intDay);
  let ms = futureDate.diff(simulatedTime);

  if (ms <= 0) {
    futureDate = dayjs(simulatedTime).day(7 + intDay);
    // ms = futureDate.diff(simulatedTime);
  }

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(
    futureDate,
    calendarBlockId,
    func,
    intervalCheckForTime
  );

  return futureDate;
};

const TakeDifferenceFromSpecificMonth = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let intMonth = months.indexOf(time.month);

  let futureDate = dayjs(simulatedTime).month(intMonth);
  let ms = futureDate.diff(simulatedTime);

  if (ms <= 0) {
    futureDate = dayjs(simulatedTime).month(12 + intMonth);
  }

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(
    futureDate,
    calendarBlockId,
    func,
    intervalCheckForTime
  );

  return futureDate;
};

const EverySecond = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let futureDate;
  if (startTime) futureDate = startTime;
  else
    futureDate = dayjs(simulatedTime).second(
      simulatedTime.second() + time.second
    );

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(
    futureDate,
    calendarBlockId,
    func,
    intervalCheckForTime
  );

  return futureDate;
};

const EveryMinute = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let futureDate;
  if (startTime) futureDate = startTime;
  else
    futureDate = dayjs(simulatedTime).minute(
      simulatedTime.minute() + time.minute
    );

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(
    futureDate,
    calendarBlockId,
    func,
    intervalCheckForTime
  );

  return futureDate;
};

const EveryHour = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let futureDate;
  if (startTime) futureDate = startTime;
  else futureDate = dayjs(simulatedTime).hour(simulatedTime.hour() + time.hour);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(
    futureDate,
    calendarBlockId,
    func,
    intervalCheckForTime
  );

  return futureDate;
};

const EveryDay = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let futureDate = dayjs(simulatedTime).day(simulatedTime.day() + time.day);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(
    futureDate,
    calendarBlockId,
    func,
    intervalCheckForTime
  );

  return futureDate;
};

const EveryMonth = function (
  time,
  calendarInfo,
  calendarBlockId,
  func,
  intervalCheckForTime,
  startTime
) {
  let futureDate = dayjs(simulatedTime).month(
    simulatedTime.month() + time.month
  );

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(
    futureDate,
    calendarBlockId,
    func,
    intervalCheckForTime,
    intervalCheckForTime
  );

  return futureDate;
};

const timeDispatch = {
  specificTime: TakeDifferenceFromSpecificTime,
  specificDay: TakeDifferenceFromSpecificDay,
  specificMonth: TakeDifferenceFromSpecificMonth,
  everySecond: EverySecond,
  everyMinute: EveryMinute,
  everyHour: EveryHour,
  everyDay: EveryDay,
  everyMonth: EveryMonth,
};

const compareStartingDate = function (a, b) {
  // Use toUpperCase() to ignore character casing
  const startTimeA = a.startTime;
  const startTimeB = b.startTime;

  let comparison = 0;
  if (startTimeA > startTimeB) {
    comparison = 1;
  } else if (startTimeA < startTimeB) {
    comparison = -1;
  }
  return comparison;
};

const PinEventInCalendar = function (
  futureTime,
  calendarInfo,
  calendarBlockId
) {
  let year = futureTime.year();
  let month = futureTime.month() + 1;
  let date = futureTime.date();

  let startTime =
    ("0" + futureTime.hour()).slice(-2) +
    ":" +
    ("0" + futureTime.minute()).slice(-2) +
    ":" +
    ("0" + futureTime.second()).slice(-2);

  let data = {};
  data[year] = {};
  data[year][month] = {};
  data[year][month][date] = [];
  data[year][month][date].push({
    startTime: startTime,
    endTime: "end",
    text: calendarInfo,
  });

  // December 14, 2020
  let dateToSave = futureTime.format("MMMM DD, YYYY");

  // save in timeIdsTodate day and startTime
  timeIdsToDate[calendarBlockId] = { day: dateToSave, startTime: startTime };
  if (!activeDateOnCalendar[dateToSave]) {
    activeDateOnCalendar[dateToSave] = [];
  }

  // push new date in activeDateOnCalendar
  activeDateOnCalendar[dateToSave].push({
    startTime: startTime,
    id: calendarBlockId,
    isFired: false,
  });

  // sort the activeDateOnCalendar for specific day
  activeDateOnCalendar[dateToSave].sort(compareStartingDate);

  /* Merge new calendar data with the existing ones */
  calendarData = deepmerge(calendarData, data);

  /* Sorting calendar data */
  calendarData[year][month][date].sort(compareStartingDate);

  organizer.updateData(calendarData);

  UpdateUIForCompletedEventsInCalendar();

  UpdateScroll("organizer-container-list-container");
};

const UpdateUIForCompletedEventsInCalendar = function () {
  let day = document.getElementById("organizer-container-date").innerHTML;

  // parse the date and take which event is marked as fired
  if (activeDateOnCalendar[day]) {
    for (let i = 0; i < activeDateOnCalendar[day].length; ++i) {
      if (document.getElementById("organizer-container-list-item-" + i)) {
        if (activeDateOnCalendar[day][i].isFired) {
          // add green border to show that the event is fired
          if (
            !document
              .getElementById("organizer-container-list-item-" + i)
              .classList.contains("calendar-event-finished")
          )
            document
              .getElementById("organizer-container-list-item-" + i)
              .classList.add("calendar-event-finished");
        }
        if (activeDateOnCalendar[day][i].isCompleted) {
          let text = document.getElementById(
            "organizer-container-list-item-" + i + "-time"
          ).innerHTML;
          text = text.replace("end", activeDateOnCalendar[day][i].endTime);
          document.getElementById(
            "organizer-container-list-item-" + i + "-time"
          ).innerHTML = text;
          if (
            $("#organizer-container-list-item-" + i + "-text").children()
              .length === 0
          ) {
            document.getElementById(
              "organizer-container-list-item-" + i + "-text"
            ).style.display = "block";
            let icon = document.createElement("img");
            icon.width = 20;
            icon.height = 20;
            icon.src = "https://img.icons8.com/flat_round/2x/checkmark.png";
            icon.style.cssFloat = "right";
            document
              .getElementById("organizer-container-list-item-" + i + "-text")
              .appendChild(icon);
          }
        }
      }
    }
  }
};
/* End data and functions for calendar - conditional blocks */

/* Start of functions for simulating time */
const TIME_MODE = Object.freeze({ normal: "NORMAL", speed: "SPEED" });

const timeSpeed = 100;
const timeSpeedInSpeedUp = 300;

let simulatedTime,
  nowTimeSpeed = timeSpeed,
  timeSpeedMultiplier = 1,
  timeFunc,
  debugTests;

const simulatedTimeTable = [];

const InitializeSimulatedTime = function () {
  simulatedTime = dayjs();
  NormalSimulatedTime();
};

const CalculateMillisecondsForNextTime = function (time) {
  if (time.type === "everySecond") {
    return time.second * 1000;
  } else if (time.type === "everyMinute") {
    return time.minute * 60000;
  } else if (time.type === "everyHour") {
    return time.hour * 3600000;
  }
  return -1;
};

const NextStartTime = function (time, millisecond) {
  if (millisecond > 0) return dayjs(time).set("millisecond", millisecond);
  return millisecond;
};

const NormalSimulatedTime = function () {
  nowTimeSpeed = timeSpeed;
  timeSpeedMultiplier = 1;
  timeFunc = setInterval(() => {
    simulatedTime = dayjs(simulatedTime).set(
      "millisecond",
      simulatedTime.millisecond() + nowTimeSpeed
    );
    // TODO: update calendar
  }, nowTimeSpeed);
  RefreshUiOnContinueTime();
  if (document.getElementById("time-speed-info"))
    document.getElementById("time-speed-info").innerHTML =
      "x" + timeSpeedMultiplier;
};

const SpeedUpSimulatedTime = function () {
  timeFunc = setInterval(() => {
    simulatedTime = dayjs(simulatedTime).set(
      "millisecond",
      simulatedTime.millisecond() + timeSpeedInSpeedUp
    );
    // TODO: update calendar
  }, nowTimeSpeed);
  RefreshUiOnContinueTime();
  if (document.getElementById("time-speed-info"))
    document.getElementById("time-speed-info").innerHTML =
      "x" + timeSpeedMultiplier;
};

const PauseSimulatedTime = function () {
  clearInterval(timeFunc);
  document
    .getElementById("time-speed-title")
    .style.setProperty("display", "none");
  document.getElementById("time-speed-info").innerHTML = "Paused";
  document
    .getElementById("time-speed-info")
    .style.setProperty("color", "#ff9966");
};

const ResetSimulatedTime = function () {
  PauseSimulatedTime();
  simulatedTime = dayjs();
  NormalSimulatedTime();
};

const GoToSpecificTime = function () {
  PauseSimulatedTime();

  // TODO: implement goto hour with simulatedTimeTable
  // TODO: update calendar
};

const AddTimeInSimulatedTable = function (time, id, func, intervalFunc) {
  simulatedTimeTable.push({
    time: time,
    id: id,
    func: func,
    intervalFunc: intervalFunc,
  });
  simulatedTimeTable.sort(compareTimes);
};

const compareTimes = function (a, b) {
  // Use toUpperCase() to ignore character casing
  const timeA = a.time;
  const timeB = b.time;

  let comparison = 0;
  if (timeA.diff(timeB) > 0) {
    comparison = 1;
  } else if (timeA.diff(timeB) < 0) {
    comparison = -1;
  }
  return comparison;
};

const IncreaseTestCounter = function () {
  return testsCounter++;
};

const CreateModal = function (idPrefix) {
  let modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = idPrefix + "-modal";
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("modal-container").appendChild(modal);

  let modalDialog = document.createElement("div");
  modalDialog.classList.add("modal-dialog", "modal-lg");
  modalDialog.id = idPrefix + "-modal-dialog";
  modalDialog.setAttribute("role", "document");
  modal.appendChild(modalDialog);

  let modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalDialog.appendChild(modalContent);

  let modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalContent.appendChild(modalHeader);

  let modalTitle = document.createElement("h5");
  modalTitle.classList.add("modal-title");
  modalTitle.id = idPrefix + "-modal-title";
  modalHeader.appendChild(modalTitle);

  // let closeModal = document.createElement("button");
  // closeModal.classList.add("close");
  // closeModal.setAttribute("type", "button");
  // closeModal.setAttribute("data-dismiss", "modal");
  // closeModal.setAttribute("aria-label", "Close");
  // modalHeader.appendChild(closeModal);

  // let closeSpan = document.createElement("span");
  // closeSpan.setAttribute("aria-hidden", "true");
  // closeSpan.innerHTML = "&times;";
  // closeModal.appendChild(closeSpan);

  let modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalBody.id = idPrefix + "-modal-body";
  modalContent.appendChild(modalBody);

  let modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  modalContent.appendChild(modalFooter);

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.id = idPrefix + "-modal-delete-button";
  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("data-dismiss", "modal");
  deleteButton.style.setProperty("left", "12px");
  deleteButton.style.setProperty("position", "absolute");
  deleteButton.style.setProperty("display", "none");
  modalFooter.appendChild(deleteButton);

  let cancelButton = document.createElement("button");
  cancelButton.classList.add("btn", "btn-secondary");
  cancelButton.id = idPrefix + "-modal-cancel-button";
  cancelButton.innerHTML = "Cancel";
  cancelButton.setAttribute("type", "button");
  cancelButton.setAttribute("data-dismiss", "modal");
  modalFooter.appendChild(cancelButton);

  let confirmButton = document.createElement("button");
  confirmButton.classList.add("btn", "btn-primary");
  confirmButton.id = idPrefix + "-modal-confirm-button";
  confirmButton.innerHTML = "Confirm";
  confirmButton.setAttribute("type", "button");
  modalFooter.appendChild(confirmButton);
};

const ClearModal = function (idPrefix) {
  document.getElementById(idPrefix + "-modal-title").innerHTML = "";
  document.getElementById(idPrefix + "-modal-body").innerHTML = "";
  document.getElementById(idPrefix + "-modal-cancel-button").innerHTML =
    "Cancel";
  document.getElementById(idPrefix + "-modal-confirm-button").innerHTML =
    "Confirm";
};

const RenderModal = function (idPrefix) {
  $("#" + idPrefix + "-modal").modal("show");
};

const DestroyModal = function (idPrefix) {
  document.getElementById(idPrefix + "-modal").remove();
};

/* End of functions for simulating time */

/* Start functions for creating test */

const CreateAndRenderTestsModal = function (projectTitle) {
  let idPrefix = "simulator-tests";
  CreateModal(idPrefix);

  // get title, body and confirm button of modal
  let title = document.getElementById(idPrefix + "-modal-title");
  let body = document.getElementById(idPrefix + "-modal-body");
  let confirmButton = document.getElementById(
    idPrefix + "-modal-confirm-button"
  );
  let cancelButton = document.getElementById(idPrefix + "-modal-cancel-button");

  //change title
  title.innerHTML = "Tests for " + projectTitle;

  // hide confirm button
  confirmButton.style.setProperty("display", "none");

  // change cancel button
  cancelButton.innerHTML = "Close";

  let testsContainer = document.createElement("div");
  body.appendChild(testsContainer);

  let simulateBehaviorTestsOuter = document.createElement("div");
  testsContainer.appendChild(simulateBehaviorTestsOuter);

  let simulateBehaviorTestsHeader = document.createElement("div");
  simulateBehaviorTestsHeader.innerHTML = "Simulate Behavior Tests";
  simulateBehaviorTestsHeader.style.setProperty("font-size", "large");
  simulateBehaviorTestsHeader.style.setProperty("font-weight", "500");
  simulateBehaviorTestsOuter.appendChild(simulateBehaviorTestsHeader);

  let addSimulateBehaviorTestButton = document.createElement("button");
  addSimulateBehaviorTestButton.classList.add("btn", "btn-sm", "custom-btn");
  addSimulateBehaviorTestButton.style.setProperty("border-radius", "15px");
  addSimulateBehaviorTestButton.style.setProperty("margin-left", ".5rem");
  simulateBehaviorTestsHeader.appendChild(addSimulateBehaviorTestButton);

  let addSimulateBehaviorTestIcon = document.createElement("i");
  addSimulateBehaviorTestIcon.classList.add("fas", "fa-plus");
  addSimulateBehaviorTestButton.appendChild(addSimulateBehaviorTestIcon);

  let simulateBehaviorTests = document.createElement("div");
  simulateBehaviorTests.style.setProperty("margin-top", ".3rem");
  simulateBehaviorTests.style.setProperty("border", "1px ridge #00000061");
  simulateBehaviorTests.style.setProperty("padding", "1rem");
  simulateBehaviorTests.style.setProperty("min-height", "14rem");
  simulateBehaviorTests.style.setProperty("border-radius", "15px");
  simulateBehaviorTestsOuter.appendChild(simulateBehaviorTests);

  const RenderTest = function (domSelector, test) {
    let a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.classList.add(
      "list-group-item",
      "list-group-item-action",
      "flex-column",
      "align-items-start"
    );
    domSelector.appendChild(a);

    let div = document.createElement("div");
    div.classList.add("d-flex", "w-100", "justify-content-between");
    a.appendChild("div");

    let h5 = document.createElement("h5");
    h5.classList.add("mb-1");
    h5.innerHTML = test.title;
    div.appendChild(h5);

    let small = document.createElement("small");
    small.classList.add("text-muted");
    small.innerHTML = test.time;
    div.appendChild(small);
  };

  if (debugTests.behaviorSimulationTests.length === 0) {
    let noTest = document.createElement("span");
    noTest.innerHTML = "No tests have been created yet.";
    noTest.style.setProperty("font-style", "italic");
    simulateBehaviorTests.appendChild(noTest);
  } else {
    for (const [
      index,
      simulateBehaviorTest,
    ] of debugTests.behaviorSimulationTests) {
      RenderTest(simulateBehaviorTests, simulateBehaviorTest);
    }
  }

  let checkingExpectedValuesTestsOuter = document.createElement("div");
  checkingExpectedValuesTestsOuter.style.setProperty("margin-top", "1rem");
  testsContainer.appendChild(checkingExpectedValuesTestsOuter);

  let checkingExpectedValuesTestsHeader = document.createElement("div");
  checkingExpectedValuesTestsHeader.innerHTML =
    "Expected Values Checking Tests";
  checkingExpectedValuesTestsHeader.style.setProperty("font-size", "large");
  checkingExpectedValuesTestsHeader.style.setProperty("font-weight", "500");
  checkingExpectedValuesTestsOuter.appendChild(
    checkingExpectedValuesTestsHeader
  );

  let addCheckingExpectedValuesTestButton = document.createElement("button");
  addCheckingExpectedValuesTestButton.classList.add(
    "btn",
    "btn-sm",
    "custom-btn"
  );
  addCheckingExpectedValuesTestButton.style.setProperty(
    "border-radius",
    "15px"
  );
  addCheckingExpectedValuesTestButton.style.setProperty("margin-left", ".5rem");
  checkingExpectedValuesTestsHeader.appendChild(
    addCheckingExpectedValuesTestButton
  );

  let addCheckingExpectedValuesTestIcon = document.createElement("i");
  addCheckingExpectedValuesTestIcon.classList.add("fas", "fa-plus");
  addCheckingExpectedValuesTestButton.appendChild(
    addCheckingExpectedValuesTestIcon
  );

  let checkingExpectedValuesTests = document.createElement("div");
  checkingExpectedValuesTests.style.setProperty("margin-top", ".3rem");
  checkingExpectedValuesTests.style.setProperty(
    "border",
    "1px ridge #00000061"
  );
  checkingExpectedValuesTests.style.setProperty("padding", "1rem");
  checkingExpectedValuesTests.style.setProperty("min-height", "14rem");
  checkingExpectedValuesTests.style.setProperty("border-radius", "15px");
  checkingExpectedValuesTestsOuter.appendChild(checkingExpectedValuesTests);

  if (debugTests.expectedValuesCheckingTests.length === 0) {
    let noTest = document.createElement("span");
    noTest.innerHTML = "No tests have been created yet.";
    noTest.style.setProperty("font-style", "italic");
    checkingExpectedValuesTests.appendChild(noTest);
  } else {
    for (const [
      index,
      expectedValueCheckingTest,
    ] of debugTests.expectedValuesCheckingTests) {
      RenderTest(checkingExpectedValuesTests, expectedValueCheckingTest);
    }
  }

  // Destroy Modal
  $("#" + idPrefix + "-modal").on("hidden.bs.modal", function (e) {
    DestroyModal(idPrefix);
  });

  // render modal
  $("#" + idPrefix + "-modal").modal({ backdrop: "static" });
  RenderModal(idPrefix);
};

const CreateAndRenderCreateTestModal = function (
  idPrefix,
  envData,
  givenDebugTest,
  editFlag,
  onDeleteTest
) {
  CreateModal(idPrefix);

  let title = document.getElementById(idPrefix + "-modal-title");
  let body = document.getElementById(idPrefix + "-modal-body");
  let confirmButton = document.getElementById(
    idPrefix + "-modal-confirm-button"
  );

  if (editFlag) {
    title.innerHTML = "Edit test: " + givenDebugTest.title;
    let deleteButton = document.getElementById(
      idPrefix + "-modal-delete-button"
    );
    deleteButton.style.setProperty("display", "inline-block");
    deleteButton.innerHTML = "Delete test";
    deleteButton.onclick = () => {
      onDeleteTest();
      $("#" + idPrefix + "-modal").modal("hide");
    };
  } else title.innerHTML = "New test";

  let container = document.createElement("div");
  body.appendChild(container);

  /* Input Title */
  let inputGroupTitle = document.createElement("div");
  inputGroupTitle.classList.add("input-group");
  inputGroupTitle.style.setProperty("width", "18rem");
  container.appendChild(inputGroupTitle);

  let inputGroupPrependTitle = document.createElement("div");
  inputGroupPrependTitle.classList.add("input-group-prepend");
  inputGroupTitle.appendChild(inputGroupPrependTitle);

  let inputGroupTextTitle = document.createElement("span");
  inputGroupTextTitle.classList.add("input-group-text");
  inputGroupTextTitle.id = "test-title-span";
  inputGroupTextTitle.innerHTML = "Title";
  inputGroupTextTitle.style.setProperty("width", "4rem");
  inputGroupPrependTitle.appendChild(inputGroupTextTitle);

  let inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.classList.add("form-control");
  if (editFlag) inputTitle.value = givenDebugTest.title;
  else inputTitle.value = "Test " + IncreaseTestCounter();
  inputTitle.id = "test-title";
  inputTitle.setAttribute("aria-label", "title");
  inputTitle.setAttribute("aria-describedby", "test-title-span");
  inputGroupTitle.appendChild(inputTitle);

  /* Input Color */
  let inputGroupColor = document.createElement("div");
  inputGroupColor.classList.add("input-group");
  inputGroupColor.style.setProperty("width", "18rem");
  inputGroupColor.style.setProperty("margin-top", "1rem");
  inputGroupColor.style.setProperty("padding-bottom", "1rem");
  container.appendChild(inputGroupColor);

  let inputGroupPrependColor = document.createElement("div");
  inputGroupPrependColor.classList.add("input-group-prepend");
  inputGroupColor.appendChild(inputGroupPrependColor);

  let inputGroupTextColor = document.createElement("span");
  inputGroupTextColor.classList.add("input-group-text");
  inputGroupTextColor.id = "test-color-span";
  inputGroupTextColor.innerHTML = "Color";
  inputGroupTextColor.style.setProperty("width", "4rem");
  inputGroupPrependColor.appendChild(inputGroupTextColor);

  let inputColor = document.createElement("input");
  inputColor.type = "color";
  inputColor.id = "test-color";
  inputColor.classList.add("form-control");
  if (editFlag) inputColor.value = givenDebugTest.color;
  else inputColor.value = "#D0D8DF";
  inputColor.setAttribute("aria-label", "color");
  inputColor.setAttribute("aria-describedby", "test-color-span");
  inputGroupColor.appendChild(inputColor);

  /* Headers */
  let titlesRow = document.createElement("div");
  titlesRow.classList.add("row");
  titlesRow.style.setProperty("font-size", "large");
  titlesRow.style.setProperty("font-weight", "600");
  titlesRow.style.setProperty("padding-bottom", "0.2rem");
  titlesRow.style.setProperty("border-bottom", "1px solid #27252545");
  container.appendChild(titlesRow);

  let timeSlotsHeader = document.createElement("div");
  timeSlotsHeader.classList.add("col-4");
  timeSlotsHeader.innerHTML = "Time Slots";
  titlesRow.appendChild(timeSlotsHeader);

  let propertiesChangesHeader = document.createElement("div");
  propertiesChangesHeader.classList.add("col");
  propertiesChangesHeader.innerHTML = "Changes";
  titlesRow.appendChild(propertiesChangesHeader);

  let actionContainer = document.createElement("div");
  actionContainer.id = "test-action-container";
  actionContainer.style.setProperty("overflow-y", "auto");
  actionContainer.style.setProperty("overflow-x", "hidden");
  actionContainer.style.setProperty("max-height", "26rem");
  ("");
  container.appendChild(actionContainer);

  let testsTimeSlots = [];

  if (editFlag) testsTimeSlots = givenDebugTest.testsTimeSlots;
  else {
    /* add time 0 if no time slot exists */
    let timeSlot = CreateTimeSlot(0, "Default Description", {});
    testsTimeSlots.push(timeSlot);
  }

  let timelinesOuter = document.createElement("div");
  timelinesOuter.id = "timelines-container";
  timelinesOuter.style.setProperty("margin-top", "1rem");
  actionContainer.appendChild(timelinesOuter);

  RenderTimeLine(timelinesOuter, testsTimeSlots, envData);

  $("#" + idPrefix + "-modal").on("hidden.bs.modal", function (e) {
    DestroyModal(idPrefix);
  });

  /* change modal size */
  document
    .getElementById(idPrefix + "-modal-dialog")
    .classList.remove("modal-lg");
  document.getElementById(idPrefix + "-modal-dialog").classList.add("modal-xl");

  confirmButton.onclick = () => {
    let title = document.getElementById("test-title").value;
    let color = document.getElementById("test-color").value;

    let debugTest = {
      id: "create-test-" + testsCounter,
      title: title,
      color: color,
      testsTimeSlots: testsTimeSlots,
    };

    CollectAllChangesForSave(testsTimeSlots);

    // envData.RuntimeEnvironmentRelease.functionRequest(
    //   "SmartObjectVPLEditor",
    //   "saveDebugTests",
    //   [
    //     {
    //       projectID: envData.execData.projectId,
    //       debugTest: debugTest,
    //     },
    //   ]
    // );

    if (editFlag)
      UpdateBubbleForTest(
        "test-bubble-" + givenDebugTest.id,
        envData,
        debugTest,
        idPrefix
      );
    else
      CreateBubbleForTests(
        title,
        "test-bubble-" + debugTest.id,
        color,
        testsTimeSlots,
        () => {
          CreateAndRenderCreateTestModal(
            idPrefix,
            envData,
            debugTest,
            true,
            () => {
              envData.RuntimeEnvironmentRelease.functionRequest(
                "SmartObjectVPLEditor",
                "deleteDebugTest",
                [
                  {
                    projectID: envData.execData.projectId,
                    debugTestId: debugTest.id,
                  },
                ]
              );
            }
          );
        }
      );

    $("#" + idPrefix + "-modal").modal("hide");
  };

  $("#" + idPrefix + "-modal").modal({ backdrop: "static" });

  RenderModal(idPrefix);
};

const CollectAllChangesForSave = function (testTimeSlots) {
  for (const [timeSlotIndex, timeSlot] of testTimeSlots.entries()) {
    for (const deviceId in timeSlot.devices) {
      // let deviceIndex = Object.keys(timeSlot.devices).indexOf(deviceId);
      for (let [propIndex, property] of timeSlot.devices[
        deviceId
      ].properties.entries()) {
        property.value = document.getElementById(
          timeSlot.time + "-" + deviceId + "-properties-" + propIndex + "-value"
        ).value;
      }
      for (let [actionIndex, action] of timeSlot.devices[
        deviceId
      ].actions.entries()) {
        for (let [parameterIndex, parameter] of action.parameters.entries()) {
          parameter.value = document.getElementById(
            timeSlot.time +
              "-" +
              deviceId +
              "-actions-" +
              actionIndex +
              "-value" +
              "-parameter-" +
              parameter.name
          ).value;
        }
      }
    }
  }
};

const CreateTimeSlot = function (time, description, devices, editMode = true) {
  return {
    time: time,
    description: description,
    devices: {},
    editMode: editMode,
  };
};

const RenderTimeLine = function (domSelector, timeSlotsArray, envData) {
  if (timeSlotsArray.length === 0) {
    let emptyHeader = document.createElement("div");
    emptyHeader.style.setProperty("font-style", "italic");
    emptyHeader.style.setProperty("font-size", "large");
    emptyHeader.innerHTML = "There are not time slots";
    domSelector.appendChild(emptyHeader);
  }

  let unvalidTimes = timeSlotsArray.map((x) => x.time);
  for (const [index, element] of timeSlotsArray.entries()) {
    /* give unvalid times but not the value for the element itself */
    let unvalidForElement = unvalidTimes.filter((x) => x != element.time);

    RenderTimeSlot(
      domSelector,
      element,
      unvalidForElement,
      () => {
        /* clear timelines-contatiner */
        document.getElementById("timelines-container").innerHTML = "";

        /* sort because of editing */
        timeSlotsArray.sort(compareTimeSlots);

        /* rerend all time slots */
        RenderTimeLine(
          document.getElementById("timelines-container"),
          timeSlotsArray,
          envData
        );
      },
      (newTimeSlot) => {
        timeSlotsArray.push(newTimeSlot);

        /* sort array */
        timeSlotsArray.sort(compareTimeSlots);

        /* clear timelines-contatiner */
        document.getElementById("timelines-container").innerHTML = "";

        /* rerend all time slots */
        RenderTimeLine(
          document.getElementById("timelines-container"),
          timeSlotsArray,
          envData
        );
      },
      (timeOfTimeSlot) => {
        let timeIndex = timeSlotsArray.findIndex(
          (x) => x.time === timeOfTimeSlot
        );

        timeSlotsArray.splice(timeIndex, 1);

        /* sort array */
        timeSlotsArray.sort(compareTimeSlots);

        /* clear timelines-contatiner */
        document.getElementById("timelines-container").innerHTML = "";

        /* rerend all time slots */
        RenderTimeLine(
          document.getElementById("timelines-container"),
          timeSlotsArray,
          envData
        );
      },
      envData
    );

    if (timeSlotsArray.length > 0 && index < timeSlotsArray.length - 1) {
      let hr = document.createElement("hr");
      hr.style.setProperty("border-top", "1px solid rgb(0 0 0 / 28%)");
      domSelector.appendChild(hr);
    }
  }
};

const RenderTimeSlot = function (
  domSelector,
  timeSlot,
  unvalidTimes,
  onSuccessEdit,
  onAddTimeSlot,
  onDeleteTimeSlot,
  envData
) {
  let timelineRow = document.createElement("div");
  timelineRow.classList.add("row");
  domSelector.appendChild(timelineRow);

  /* Column for the timeslot */
  let timeCol = document.createElement("div");
  timeCol.classList.add("col-4");
  timeCol.style.setProperty("border-right", "1px solid rgb(35 30 30 / 45%)");
  timeCol.style.setProperty("position", "relative");
  timeCol.style.setProperty("display", "flex");
  timeCol.style.setProperty("align-items", "center");
  timelineRow.appendChild(timeCol);

  let timelineInfo = document.createElement("div");
  timelineInfo.style.setProperty("width", "100%");
  timelineInfo.style.setProperty("padding-bottom", "3rem");
  timeCol.appendChild(timelineInfo);

  /* Time in timeslot */
  let timelineTitleRow = document.createElement("div");
  timelineTitleRow.classList.add("row");
  timelineInfo.appendChild(timelineTitleRow);

  let timelineTitleTimeCol = document.createElement("div");
  timelineTitleTimeCol.classList.add("col-5");
  timelineTitleRow.appendChild(timelineTitleTimeCol);

  let timelineTitleTime = document.createElement("div");
  timelineTitleTime.innerHTML = "Time (seconds): ";
  timelineTitleTime.style.setProperty("font-size", "large");
  timelineTitleTimeCol.appendChild(timelineTitleTime);

  let timeSecondsCol = document.createElement("div");
  timeSecondsCol.classList.add("col");
  timelineTitleRow.appendChild(timeSecondsCol);

  let timeSeconds = document.createElement("div");
  timeSeconds.id = "_time-" + timeSlot.time + "-time";
  timeSeconds.innerHTML = timeSlot.time;
  timeSeconds.style.setProperty("font-style", "italic");
  timeSeconds.style.setProperty("font-size", "large");
  timeSecondsCol.appendChild(timeSeconds);

  let timeSecondsInput = document.createElement("input");
  timeSecondsInput.type = "number";
  timeSecondsInput.min = 0;
  timeSecondsInput.id = "_time-" + timeSlot.time + "-time-vlaue";
  timeSecondsInput.value = timeSlot.time;
  timeSecondsCol.appendChild(timeSecondsInput);

  /* Description in timeslot */
  let timelineDescriptionRow = document.createElement("div");
  timelineDescriptionRow.classList.add("row");
  timelineDescriptionRow.style.setProperty("margin-top", "0.5rem");
  timelineInfo.appendChild(timelineDescriptionRow);

  let timelineTitleDescriptionCol = document.createElement("div");
  timelineTitleDescriptionCol.classList.add("col-5");
  timelineTitleDescriptionCol.style.setProperty("font-size", "large");
  timelineDescriptionRow.appendChild(timelineTitleDescriptionCol);

  let timelineTitleDescription = document.createElement("div");
  timelineTitleDescription.innerHTML = "Description: ";
  timelineTitleDescriptionCol.appendChild(timelineTitleDescription);

  let timelineTitleDescriptionValueCol = document.createElement("div");
  timelineTitleDescriptionValueCol.classList.add("col");
  timelineDescriptionRow.appendChild(timelineTitleDescriptionValueCol);

  let timeDescription = document.createElement("span");
  timeDescription.id = "_time-" + timeSlot.time + "-description";
  timeDescription.innerHTML = timeSlot.description;
  timeDescription.style.setProperty("font-style", "italic");
  timeDescription.style.setProperty("font-size", "large");
  timelineTitleDescriptionValueCol.appendChild(timeDescription);

  let timeDescriptionInput = document.createElement("input");
  timeDescriptionInput.type = "text";
  timeDescriptionInput.id = "_time-" + timeSlot.time + "-description-value";
  timeDescriptionInput.value = timeSlot.description;
  timelineTitleDescriptionValueCol.appendChild(timeDescriptionInput);

  if (!timeSlot.editMode) {
    timeSecondsInput.style.setProperty("display", "none");
    timeDescriptionInput.style.setProperty("display", "none");
  } else {
    timeSeconds.style.setProperty("display", "none");
    timeDescription.style.setProperty("display", "none");
  }

  /* Functionality in timeslot */
  let timelineFunctionalityOuter = document.createElement("div");
  timelineFunctionalityOuter.style.setProperty("position", "absolute");
  timelineFunctionalityOuter.style.setProperty("bottom", "0px");
  timelineFunctionalityOuter.style.setProperty("right", "11px");
  timeCol.appendChild(timelineFunctionalityOuter);

  let timelineEditSpan = document.createElement("span");
  timelineEditSpan.id = "_time-" + timeSlot.time + "edit-button";
  timelineFunctionalityOuter.appendChild(timelineEditSpan);

  let timelineEditButton = document.createElement("button");
  timelineEditButton.classList.add("btn", "btn-sm", "btn-info");
  timelineEditButton.innerHTML = "<i class='fas fa-edit'></i>";
  timelineEditButton.onclick = () => {
    /* Change view of buttons in time slot */
    timelineEditSpan.style.setProperty("display", "none");
    timelineDeleteSpan.style.setProperty("display", "none");
    addTimeLineOuter.style.setProperty("display", "none");
    applyButton.style.setProperty("display", "block");

    timeSeconds.style.setProperty("display", "none");
    timeDescription.style.setProperty("display", "none");

    timeSecondsInput.style.setProperty("display", "block");
    timeDescriptionInput.style.setProperty("display", "block");

    timeSlot.editMode = true;
  };
  timelineEditSpan.appendChild(timelineEditButton);

  let timelineDeleteSpan = document.createElement("span");
  timelineDeleteSpan.style.setProperty("margin-left", "0.7rem");
  timelineDeleteSpan.id = "_time-" + timeSlot.time + "delete-button";
  timelineFunctionalityOuter.appendChild(timelineDeleteSpan);

  let timelineDeleteButton = document.createElement("button");
  timelineDeleteButton.classList.add("btn", "btn-sm", "btn-danger");
  timelineDeleteButton.onclick = () => {
    onDeleteTimeSlot(timeSlot.time);
  };
  timelineDeleteButton.innerHTML = "<i class='far fa-trash-alt'></i>";
  timelineDeleteSpan.appendChild(timelineDeleteButton);

  /* Add time slot */
  let addTimeLineOuter = document.createElement("div");
  // addTimeLineOuter.style.setProperty("padding-top", "1rem");
  addTimeLineOuter.style.setProperty("position", "absolute");
  addTimeLineOuter.style.setProperty("bottom", "0px");
  timeCol.appendChild(addTimeLineOuter);

  let addTimeLineLink = document.createElement("a");
  addTimeLineLink.style.setProperty("width", "fit-content");
  addTimeLineLink.href = "javascript:void(0);";
  addTimeLineLink.innerHTML = "Add time slot";
  addTimeLineLink.onclick = () => {
    let newTime = timeSlot.time + 1;
    while (unvalidTimes.includes(newTime)) {
      newTime = newTime + 1;
    }
    let newTimeSlot = CreateTimeSlot(newTime, "Default desctiption", {});

    onAddTimeSlot(newTimeSlot);
  };
  addTimeLineOuter.appendChild(addTimeLineLink);

  /* Apply button for editing */
  let applyButton = document.createElement("button");
  applyButton.classList.add("btn", "btn-sm", "btn-success");
  timelineDeleteButton.id = "_time-" + timeSlot.time + "apply-button";
  applyButton.innerHTML = "Apply";
  applyButton.onclick = () => {
    let newTime = parseFloat(
      document.getElementById("_time-" + timeSlot.time + "-time-vlaue").value
    );

    if (unvalidTimes.includes(newTime)) {
      /* unvalid time slot */
    } else {
      let newDescription = document.getElementById(
        "_time-" + timeSlot.time + "-description-value"
      ).value;
      /* Set new values */
      timeSlot.time = newTime;
      timeSlot.description = newDescription;

      timeSlot.editMode = false;

      /* Chnage view on functionality */
      onSuccessEdit();
    }
  };
  timelineFunctionalityOuter.appendChild(applyButton);

  if (!timeSlot.editMode) {
    applyButton.style.setProperty("display", "none");
  } else {
    timelineEditSpan.style.setProperty("display", "none");
    timelineDeleteSpan.style.setProperty("display", "none");
    addTimeLineOuter.style.setProperty("display", "none");
  }

  /* Changes Column */
  let changesCol = document.createElement("div");
  changesCol.classList.add("col");
  changesCol.style.setProperty("position", "relative");
  timelineRow.appendChild(changesCol);

  let changesContainer = document.createElement("div");
  changesContainer.classList.add("create-test-changes-container");
  changesContainer.style.setProperty("max-height", "23rem");
  changesContainer.style.setProperty("overflow-y", "auto");
  changesContainer.style.setProperty("padding-bottom", "2.5rem");
  changesCol.appendChild(changesContainer);

  let addChangeOuterDiv = document.createElement("div");
  changesCol.appendChild(addChangeOuterDiv);

  let addChange = document.createElement("a");
  addChange.href = "javascript:void(0);";
  addChange.onclick = () => {
    addChange.style.setProperty("display", "none");
    AddDeviceActionOrPropertyChange(
      addChangeOuterDiv,
      (deviceId, deviceIndex, typeOfChange, changeIndex) => {
        addChange.style.display = "block";

        changesContainer.innerHTML = "";

        addChangeOuterDiv.style.removeProperty("width");
        // addChangeOuterDiv.style.setProperty("position", "absolute");
        if (!timeSlot.devices[deviceId]) {
          timeSlot.devices[deviceId] = { properties: [], actions: [] };
        }

        if (typeOfChange === "property") {
          timeSlot.devices[deviceId].properties.push(
            JSON.parse(
              JSON.stringify(
                devicesOnAutomations[deviceIndex].properties[changeIndex]
              )
            )
          );
        } else if (typeOfChange === "action") {
          timeSlot.devices[deviceId].actions.push(
            JSON.parse(
              JSON.stringify(
                devicesOnAutomations[deviceIndex].actions[changeIndex]
              )
            )
          );
        }

        RenderChangesForCreatingTest(changesContainer, timeSlot, envData);
      }
    );
  };
  addChange.innerHTML = "Add device's action or property change";
  addChange.style.setProperty("width", "fit-content");
  addChangeOuterDiv.appendChild(addChange);

  if (Object.entries(timeSlot.devices).length === 0) {
    let message = document.createElement("div");
    message.style.setProperty("font-size", "large");
    message.style.setProperty("font-style", "italic");
    message.innerHTML = "There is not any action or property change";
    changesContainer.appendChild(message);
  } else {
    RenderChangesForCreatingTest(changesContainer, timeSlot, envData);
  }
};

const AddDeviceActionOrPropertyChange = function (domSelector, onAdd) {
  domSelector.style.removeProperty("position");
  domSelector.style.setProperty("width", "17rem");

  let selectionDeviceDiv = document.createElement("div");
  selectionDeviceDiv.style.setProperty("margin-top", "1rem");
  domSelector.appendChild(selectionDeviceDiv);

  let inputGroupSelectDevice = document.createElement("div");
  inputGroupSelectDevice.classList.add("input-group");
  inputGroupSelectDevice.style.setProperty("width", "17rem");
  selectionDeviceDiv.appendChild(inputGroupSelectDevice);

  let inputGroupPrependSelectDevice = document.createElement("div");
  inputGroupPrependSelectDevice.classList.add("input-group-prepend");
  inputGroupSelectDevice.appendChild(inputGroupPrependSelectDevice);

  let inputGroupTextSelectDevice = document.createElement("span");
  inputGroupTextSelectDevice.classList.add("input-group-text");
  inputGroupTextSelectDevice.id = "select-device-text";
  inputGroupTextSelectDevice.style.setProperty("width", "5rem");
  inputGroupTextSelectDevice.innerHTML = "Device";
  inputGroupPrependSelectDevice.appendChild(inputGroupTextSelectDevice);

  let selectDevice = document.createElement("select");
  selectDevice.classList.add("form-control");
  selectDevice.setAttribute("aria-label", "Device");
  selectDevice.setAttribute("aria-describedby", "select-device-text");
  selectDevice.oninput = function (e) {
    // sting of device index
    let deviceIndexStr =
      e.target.options[e.target.selectedIndex].dataset.deviceIndex;
    let deviceIndex = parseInt(deviceIndexStr);

    let deviceId = e.target.options[e.target.selectedIndex].dataset.deviceId;

    // remove children of select change
    selectChange.innerHTML = "";

    addChangeButton.style.setProperty("display", "none");

    selectChange.dataset.forDeviceId = deviceId;
    selectChange.dataset.forDeviceIndex = deviceIndex;

    // update options
    let optionChangeDefault = document.createElement("option");
    optionChangeDefault.selected = true;
    optionChangeDefault.disabled = true;
    optionChangeDefault.textContent = "<select change>";
    selectChange.appendChild(optionChangeDefault);

    let optGroupAction = document.createElement("optgroup");
    optGroupAction.setAttribute("label", "Actions");
    selectChange.appendChild(optGroupAction);

    for (const [index, action] of devicesOnAutomations[
      deviceIndex
    ].actions.entries()) {
      let option = document.createElement("option");
      option.dataset.index = index;
      option.dataset.element = "action";
      option.innerHTML = action.name;
      selectChange.appendChild(option);
    }

    let optGroupProperty = document.createElement("optgroup");
    optGroupProperty.setAttribute("label", "Properties");
    selectChange.appendChild(optGroupProperty);

    for (const [index, property] of devicesOnAutomations[
      deviceIndex
    ].properties.entries()) {
      let option = document.createElement("option");
      option.dataset.index = index;
      option.dataset.element = "property";
      option.innerHTML = property.name;
      selectChange.appendChild(option);
    }

    inputGroupSelectChange.style.setProperty("display", "flex");
  };
  inputGroupSelectDevice.appendChild(selectDevice);

  let optionDefault = document.createElement("option");
  optionDefault.selected = true;
  optionDefault.disabled = true;
  optionDefault.textContent = "<select device>";
  selectDevice.appendChild(optionDefault);

  for (const [index, device] of devicesOnAutomations.entries()) {
    let option = document.createElement("option");
    option.dataset.deviceIndex = index;
    option.dataset.deviceId = device.id;
    option.innerHTML = device.name;
    selectDevice.appendChild(option);
  }

  // collect actions and properties of device
  let inputGroupSelectChange = document.createElement("div");
  inputGroupSelectChange.classList.add("input-group");
  inputGroupSelectChange.style.setProperty("margin-top", ".5rem");
  inputGroupSelectChange.style.setProperty("width", "17rem");
  inputGroupSelectChange.style.setProperty("display", "none");
  selectionDeviceDiv.appendChild(inputGroupSelectChange);

  let inputGroupPrependSelectChange = document.createElement("div");
  inputGroupPrependSelectChange.classList.add("input-group-prepend");
  inputGroupSelectChange.appendChild(inputGroupPrependSelectChange);

  let inputGrouptSelectChange = document.createElement("span");
  inputGrouptSelectChange.classList.add("input-group-text");
  inputGrouptSelectChange.id = "select-change-text";
  inputGrouptSelectChange.style.setProperty("width", "5rem");
  inputGrouptSelectChange.innerHTML = "Change";
  inputGroupPrependSelectChange.appendChild(inputGrouptSelectChange);

  let selectChange = document.createElement("select");
  selectChange.classList.add("form-control");
  selectChange.setAttribute("aria-label", "Device");
  selectChange.setAttribute("aria-describedby", "select-device-text");
  selectChange.oninput = function (e) {
    addChangeButton.style.setProperty("display", "block");
    // hide add button
    addChangeButton.onclick = () => {
      let deviceId = this.dataset.forDeviceId;

      let deviceIndexStr = this.dataset.forDeviceIndex;
      let deviceIndex = parseInt(deviceIndexStr);

      let typeOfChange =
        e.target.options[e.target.selectedIndex].dataset.element;

      let changeIndexStr =
        e.target.options[e.target.selectedIndex].dataset.index;
      let changeIndex = parseInt(changeIndexStr);

      selectionDeviceDiv.remove();
      onAdd(deviceId, deviceIndex, typeOfChange, changeIndex);
    };
  };
  inputGroupSelectChange.appendChild(selectChange);

  let addChangeButton = document.createElement("button");
  addChangeButton.classList.add("btn", "btn-sm", "btn-success");
  addChangeButton.style.setProperty("float", "right");
  addChangeButton.style.setProperty("margin-top", ".5rem");
  addChangeButton.style.setProperty("display", "none");
  addChangeButton.innerHTML = "Add";
  selectionDeviceDiv.appendChild(addChangeButton);
};

const RenderChangesForCreatingTest = function (
  domContainer,
  timeSlot,
  envData
) {
  let devicesLength = Object.keys(timeSlot.devices).length;
  let i = 0;
  for (const device in timeSlot.devices) {
    if (
      timeSlot.devices[device].properties.length > 0 ||
      timeSlot.devices[device].actions.length > 0
    ) {
      let deviceName = devicesOnAutomations.find((x) => x.id === device).name;
      let deviceData = devicesOnAutomations.find((x) => x.id === device);

      let deviceContainer = document.createElement("div");
      deviceContainer.classList.add("card");
      deviceContainer.id = device + "create-test-container";
      if (i != 0) deviceContainer.style.setProperty("margin-top", "1rem");
      deviceContainer.style.setProperty("width", "98%");
      domContainer.appendChild(deviceContainer);

      let deviceTitleHeader = document.createElement("div");
      deviceTitleHeader.classList.add("card-header");
      deviceTitleHeader.style.setProperty("font-size", "large");
      deviceTitleHeader.style.setProperty("font-weight", "600");
      deviceTitleHeader.style.setProperty("padding-top", ".2rem");
      deviceTitleHeader.style.setProperty("padding-bottom", ".2rem");
      deviceContainer.appendChild(deviceTitleHeader);

      let foldButtonOuter = document.createElement("span");
      foldButtonOuter.classList.add("fold-smart-device-create-test");
      foldButtonOuter.onclick = () => {
        deviceChangesContainer.style.setProperty("display", "none");
        foldButtonOuter.style.setProperty("display", "none");
        expandButtonOuter.style.setProperty("display", "initial");
      };
      deviceTitleHeader.appendChild(foldButtonOuter);

      let foldButton = document.createElement("i");
      foldButton.classList.add("fas", "fa-caret-down", "fa-lg");
      foldButtonOuter.appendChild(foldButton);

      let expandButtonOuter = document.createElement("span");
      expandButtonOuter.classList.add("fold-smart-device-create-test");
      expandButtonOuter.style.setProperty("display", "none");
      expandButtonOuter.onclick = () => {
        deviceChangesContainer.style.setProperty("display", "block");
        expandButtonOuter.style.setProperty("display", "none");
        foldButtonOuter.style.setProperty("display", "initial");
      };
      deviceTitleHeader.appendChild(expandButtonOuter);

      let expandButton = document.createElement("i");
      expandButton.classList.add("fas", "fa-caret-right", "fa-lg");
      expandButtonOuter.appendChild(expandButton);

      let deviceTitle = document.createElement("span");
      deviceTitle.innerHTML = deviceName;
      deviceTitle.style.setProperty("margin-left", ".5rem");
      deviceTitleHeader.appendChild(deviceTitle);

      // let deviceTitleHr = document.createElement("hr");
      // deviceTitleHr.style.setProperty("width", "100%");
      // deviceTitleHr.style.setProperty("background-color", "#00000038");
      // deviceContainer.appendChild(deviceTitleHr);

      let deviceChangesContainer = document.createElement("div");
      deviceChangesContainer.classList.add("card-body");
      deviceContainer.appendChild(deviceChangesContainer);

      for (const [index, property] of timeSlot.devices[
        device
      ].properties.entries()) {
        RenderPropertyChangeForCreatingTest(
          deviceChangesContainer,
          property,
          device,
          timeSlot.time + "-" + device + "-properties-" + index + "-value",
          () => {
            /* remove property */
            timeSlot.devices[device].properties.splice(index, 1);
            if (timeSlot.devices[device].properties.length === 0) {
              delete timeSlot.devices[device].properties;
              if (timeSlot.devices[device].actions.length === 0)
                delete timeSlot.devices[device];
            }

            /* clear container of properties */
            domContainer.innerHTML = "";

            /* render again properties */
            RenderChangesForCreatingTest(domContainer, timeSlot, envData);
          },
          envData
        );
      }
      for (const [index, action] of timeSlot.devices[
        device
      ].actions.entries()) {
        let actionCof;
        RenderActionChangeForCreatingTest(
          deviceChangesContainer,
          action,
          device,
          timeSlot.time + "-" + device + "-actions-" + index + "-value",
          () => {
            /* remove property */
            timeSlot.devices[device].actions.splice(index, 1);
            if (timeSlot.devices[device].actions.length === 0) {
              delete timeSlot.devices[device].actions;
              if (timeSlot.devices[device].properties.length === 0)
                delete timeSlot.devices[device];
            }

            /* clear container of properties */
            domContainer.innerHTML = "";

            /* render again properties */
            RenderChangesForCreatingTest(domContainer, timeSlot, envData);
          },
          envData
        );
      }
    }
    i = i + 1;
  }
};

const RenderPropertyChangeForCreatingTest = function (
  domSelector,
  property,
  deviceId,
  propertyInputID,
  onDeleteProperty
) {
  let propertyOuter = document.createElement("div");
  propertyOuter.style.display = "flex";
  propertyOuter.style.setProperty("margin-top", ".5rem");
  propertyOuter.style.setProperty("border-radius", "6px");
  propertyOuter.style.setProperty("border", "1px solid rgba(0, 0, 0, 0.17)");
  propertyOuter.style.setProperty("width", "90%");
  propertyOuter.style.setProperty("padding-top", "0.4rem");
  propertyOuter.style.setProperty("padding-bottom", "0.4rem");
  propertyOuter.style.setProperty("align-items", "center");
  domSelector.appendChild(propertyOuter);

  let spanPropertyView = document.createElement("span");
  spanPropertyView.style.setProperty("width", "85%");
  spanPropertyView.style.setProperty("margin-left", "2rem");
  propertyOuter.appendChild(spanPropertyView);

  Automatic_IoT_UI_Generator.RenderPropertyForCreatingTest(
    spanPropertyView,
    deviceId,
    property,
    propertyInputID,
    "col-4"
  );

  let spanDeleteProperty = document.createElement("span");
  spanDeleteProperty.style.setProperty("margin-left", "1rem");
  propertyOuter.appendChild(spanDeleteProperty);

  let deleteProperty = document.createElement("button");
  deleteProperty.classList.add("btn", "btn-danger", "btn-sm");
  deleteProperty.onclick = onDeleteProperty;
  spanDeleteProperty.appendChild(deleteProperty);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt");
  deleteProperty.appendChild(deleteIcon);
};

const RenderActionChangeForCreatingTest = function (
  domSelector,
  action,
  deviceId,
  actionID,
  onDeleteAction,
  envData
) {
  let actionOuter = document.createElement("div");
  actionOuter.style.display = "flex";
  actionOuter.style.setProperty("align-items", "center");
  actionOuter.style.setProperty("border", "1px solid #0000002b");
  actionOuter.style.setProperty("width", "90%");
  actionOuter.style.setProperty("padding-top", ".4rem");
  actionOuter.style.setProperty("padding-bottom", ".4rem");
  actionOuter.style.setProperty("padding-right", "1rem");
  actionOuter.style.setProperty("border-radius", "6px");
  actionOuter.style.setProperty("position", "relative");
  actionOuter.style.setProperty("margin-top", ".5rem");
  domSelector.appendChild(actionOuter);

  let spanActionView = document.createElement("span");
  spanActionView.style.setProperty("width", "100%");
  spanActionView.style.setProperty("margin-left", "1rem");
  actionOuter.appendChild(spanActionView);

  Automatic_IoT_UI_Generator.RenderActionForCreatingTest(
    spanActionView,
    deviceId,
    action,
    {
      onClickDebugConfigurationOfAction: (action, privilege) => {
        // hide running automations
        envData.RuntimeEnvironmentRelease.functionRequest(
          "SmartObjectVPLEditor",
          "foldRunTimeModal",
          []
        );

        // render modal for action configuration
        let deviceEditorId = devicesOnAutomations.find((x) => x.id === deviceId)
          .editorId;

        envData.RuntimeEnvironmentRelease.functionRequest(
          "SmartObjectVPLEditor",
          "clickDebugConfigurationOfAction",
          [deviceEditorId, action, privilege]
        );
      },
    },
    actionID,
    devicesOnAutomations.find((x) => x.id === deviceId).properties
  );

  let spanDeleteAction = document.createElement("span");
  spanDeleteAction.style.setProperty("top", "7px");
  spanDeleteAction.style.setProperty("right", "12px");
  spanDeleteAction.style.setProperty("position", "absolute");
  actionOuter.appendChild(spanDeleteAction);

  let deleteAction = document.createElement("button");
  deleteAction.classList.add("btn", "btn-danger", "btn-sm");
  deleteAction.onclick = onDeleteAction;
  spanDeleteAction.appendChild(deleteAction);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt");
  deleteAction.appendChild(deleteIcon);
};

const DefineFunctionForDebugImplementation = function (action) {
  let str = `<xml id="startBlocks" style="display: none">`;
  if (action.parameters.length > 0) {
    str += "<variables>";
    for (const parameter of action.parameters) {
      str +=
        "<variable id='" +
        action.id +
        parameter.name +
        "'>" +
        parameter.name +
        "_arg" +
        "</variable>";
    }
    str += "</variables>";
  }

  str +=
    `<block type="procedures_defnoreturn" id="` +
    action.id +
    `" x="138" y="38">`;
  if (action.parameters.length > 0) {
    str += "<mutation>";
    for (const parameter of action.parameters) {
      str +=
        "<arg name='" +
        parameter.name +
        "_arg' varid='" +
        action.id +
        parameter.name +
        "'></arg>";
    }
    str += "</mutation>";
  }
  str +=
    `<field name="NAME">` +
    action.name +
    `</field>
    <comment pinned="false" h="80" w="160">Implementation of action \"` +
    action.name +
    `\" that runs on debug mode
    </comment>
  </block>
</xml>`;
  return str;
};

const compareTimeSlots = function (a, b) {
  // Use toUpperCase() to ignore character casing
  const timeA = a.time;
  const timeB = b.time;

  let comparison = 0;
  if (timeA > timeB) {
    comparison = 1;
  } else if (timeA < timeB) {
    comparison = -1;
  }
  return comparison;
};

const CreateBubbleForTests = function (
  title,
  bubbleId,
  backgroundColor,
  testTimeSlots,
  onClick
) {
  let logBubble = document.createElement("div");
  logBubble.classList.add("log-bubble");
  logBubble.id = bubbleId;
  logBubble.style.backgroundColor = backgroundColor;
  logBubble.onclick = onClick;
  document.getElementById("tests").appendChild(logBubble);

  let logBubbleInfo = document.createElement("div");
  logBubbleInfo.classList.add("log-bubble-info");
  logBubbleInfo.style.setProperty("width", "100%");
  logBubbleInfo.style.setProperty("height", "1rem");
  logBubble.appendChild(logBubbleInfo);

  let logBubbleIconSpan = document.createElement("span");
  logBubbleIconSpan.style.cssFloat = "left";
  logBubbleInfo.appendChild(logBubbleIconSpan);

  let logBubbleIcon = document.createElement("i");
  logBubbleIcon.classList.add("log-bubble-icon", "fas", "fa-file");
  // logBubbleIcon.style.setProperty("color", "rgb(23 162 184)");
  logBubbleIconSpan.appendChild(logBubbleIcon);

  let logBubbleName = document.createElement("span");
  logBubbleName.classList.add("log-bubble-name");
  logBubbleName.id = bubbleId + "-title";
  // logBubbleName.style.setProperty("color", "rgb(23 162 184)");
  logBubbleName.innerHTML = title;
  logBubbleInfo.appendChild(logBubbleName);

  // let logBubbleTime = document.createElement("span");
  // logBubbleTime.classList.add("log-bubble-time");
  // logBubbleTime.innerHTML = simulatedTime.format("HH:mm:ss, DD/MM");
  // logBubbleInfo.appendChild(logBubbleTime);

  // let strBuilder = BuildTextForBubble(testTimeSlots);

  let logBubbleText = document.createElement("div");
  logBubbleText.classList.add("log-bubble-text-tests");
  logBubbleText.id = bubbleId + "-text";
  // logBubbleText.style.setProperty("color", "rgb(23 162 184)");
  // logBubbleText.innerHTML = strBuilder;

  BuildTextForBubble(logBubbleText, testTimeSlots);

  logBubble.appendChild(logBubbleText);

  // UpdateScroll("logger-body");
};

const UpdateBubbleForTest = function (bubbleId, envData, debugTest, idPrefix) {
  let bubble = document.getElementById(bubbleId);
  bubble.style.backgroundColor = debugTest.color;
  bubble.onclick = () => {
    CreateAndRenderCreateTestModal(idPrefix, envData, debugTest, true);
  };

  let bubbleName = document.getElementById(bubbleId + "-title");
  bubbleName.innerHTML = debugTest.title;

  // let strBuilder = BuildTextForBubble(debugTest.testsTimeSlots);

  let bubbleText = document.getElementById(bubbleId + "-text");
  // bubbleText.innerHTML = strBuilder;
  bubbleText.innerHTML = "";

  BuildTextForBubble(bubbleText, debugTest.testsTimeSlots);
};

const BuildTextForBubble = function (domElement, testTimeSlots) {
  // let strBuilder = "";
  let ul = document.createElement("ul");
  if (
    testTimeSlots.length === 0 ||
    (testTimeSlots.length === 1 &&
      Object.keys(testTimeSlots[0].devices).length === 0)
  ) {
    ul.innerHTML = "There are not any changes";
    // strBuilder += "There are not any changes";
  }
  for (const timeSlot of testTimeSlots) {
    let li = document.createElement("li");
    if (Object.keys(timeSlot.devices).length > 0) {
      // strBuilder +=
      //   "<b>-</b>After <b>" + timeSlot.time + " seconds:</b> <br>Changes on";

      li.innerHTML =
        "After <b>" + timeSlot.time + " seconds:</b> <br>Changes on";
    } else continue;
    // strBuilder += "Time " + timeSlot.time + ":<br>";
    for (const deviceId in timeSlot.devices) {
      let deviceIndex = Object.keys(timeSlot.devices).indexOf(deviceId);
      // strBuilder +=
      //   " <b>" +
      //   devicesOnAutomations.find((x) => x.id === deviceId).name +
      //   "</b>";
      li.innerHTML +=
        " <b>" +
        devicesOnAutomations.find((x) => x.id === deviceId).name +
        "</b>";
      // for (const [index, property] of timeSlot.devices[
      //   deviceId
      // ].properties.entries()) {
      //   strBuilder += " Changes value of <b>" + property.name + "</b>";
      //   if (index != timeSlot.devices[deviceId].properties.length - 1) {
      //     strBuilder += ", ";
      //   }
      // }
      // for (const [index, action] of timeSlot.devices[
      //   deviceId
      // ].actions.entries()) {
      //   strBuilder += " Triggers <b>" + action.name + "</b>";
      //   if (index != timeSlot.devices[deviceId].actions.length - 1) {
      //     strBuilder += ", ";
      //   }
      // }
      if (deviceIndex != Object.keys(timeSlot.devices).length - 1) {
        // strBuilder += ", ";
        li.innerHTML += ", ";
      }
    }
    // strBuilder += "<br>";
    ul.appendChild(li);
  }
  domElement.appendChild(ul);
  // return strBuilder;
};
/* End functions for creating test */

/* Start UI for runtime environment */
const InitializeClocks = function (selector, onComplete) {
  let outerClockDiv = document.createElement("div");
  outerClockDiv.id = "clocks-controls-outer";
  outerClockDiv.style.setProperty("margin-left", "1rem");
  outerClockDiv.style.setProperty("width", "14.5rem");
  selector.appendChild(outerClockDiv);

  let digitalClock = document.createElement("div");
  digitalClock.id = "digital-clock";
  digitalClock.style.setProperty("margin-top", ".5rem");
  outerClockDiv.appendChild(digitalClock);

  let fill = document.createElement("div");
  fill.id = "analog-clock";
  fill.classList.add("fill");
  fill.style.setProperty("width", "130px");
  fill.style.setProperty("height", "130px");
  fill.style.setProperty("margin-left", "3.5rem");
  outerClockDiv.appendChild(fill);

  let utility_clock = document.createElement("div");
  utility_clock.id = "utility-clock";
  utility_clock.classList.add("clock");
  utility_clock.classList.add("hour-style-text-quarters");
  utility_clock.classList.add("hour-text-style-large");
  utility_clock.classList.add("hour-display-style-all");
  utility_clock.classList.add("minute-style-line");
  utility_clock.classList.add("minute-display-style-fine");
  utility_clock.classList.add("minute-text-style-none");
  utility_clock.classList.add("hand-style-normal");
  fill.appendChild(utility_clock);

  let centre = document.createElement("div");
  centre.classList.add("centre");
  utility_clock.appendChild(centre);

  let dynamic = document.createElement("div");
  dynamic.classList.add("dynamic");
  centre.appendChild(dynamic);

  let circle_1 = document.createElement("div");
  circle_1.classList.add("expand");
  circle_1.classList.add("round");
  circle_1.classList.add("circle-1");
  centre.appendChild(circle_1);

  let anchorHour = document.createElement("div");
  anchorHour.classList.add("anchor");
  anchorHour.classList.add("hour");
  centre.appendChild(anchorHour);

  let anchorSub1 = document.createElement("div");
  anchorSub1.classList.add("element");
  anchorSub1.classList.add("thin-hand");
  anchorHour.appendChild(anchorSub1);

  let anchorSub2 = document.createElement("div");
  anchorSub2.classList.add("element");
  anchorSub2.classList.add("fat-hand");
  anchorHour.appendChild(anchorSub2);

  let anchorMinute = document.createElement("div");
  anchorMinute.classList.add("anchor");
  anchorMinute.classList.add("minute");
  centre.appendChild(anchorMinute);

  let anchorMinSub1 = document.createElement("div");
  anchorMinSub1.classList.add("element");
  anchorMinSub1.classList.add("thin-hand");
  anchorMinute.appendChild(anchorMinSub1);

  let anchorMinSub2 = document.createElement("div");
  anchorMinSub2.classList.add("element");
  anchorMinSub2.classList.add("fat-hand");
  anchorMinSub2.classList.add("minute-hand");
  anchorMinute.appendChild(anchorMinSub2);

  let anchorSecond = document.createElement("div");
  anchorSecond.id = "anchor-second";
  anchorSecond.classList.add("anchor");
  anchorSecond.classList.add("second");
  centre.appendChild(anchorSecond);

  let anchorSecSub1 = document.createElement("div");
  anchorSecSub1.classList.add("element");
  anchorSecSub1.classList.add("second-hand");
  anchorSecSub1.classList.add("second-hand-front");
  anchorSecond.appendChild(anchorSecSub1);

  let anchorSecSub2 = document.createElement("div");
  anchorSecSub2.classList.add("element");
  anchorSecSub2.classList.add("second-hand");
  anchorSecSub2.classList.add("second-hand-back");
  anchorSecond.appendChild(anchorSecSub2);

  let circle_2 = document.createElement("div");
  circle_2.classList.add("expand");
  circle_2.classList.add("round");
  circle_2.classList.add("circle-2");
  centre.appendChild(circle_2);

  onComplete();
};

const InitializeSimulatorControls = function ({
  dom,
  onNormalSpeed,
  onPauseTime,
  onBackward,
  onSpeedUpTime,
  onGoToSpecificTime,
}) {
  let timeSpeedOuter = document.createElement("div");
  timeSpeedOuter.id = "time-speed-outer";
  timeSpeedOuter.style.setProperty("text-align", "center");
  timeSpeedOuter.style.setProperty("font-size", "large");
  dom.appendChild(timeSpeedOuter);

  let timeSpeedTitle = document.createElement("span");
  timeSpeedTitle.id = "time-speed-title";
  timeSpeedTitle.innerHTML = "Speed: ";
  timeSpeedTitle.style.setProperty("font-style", "italic");
  timeSpeedOuter.appendChild(timeSpeedTitle);

  let timeSpeedInfo = document.createElement("span");
  timeSpeedInfo.id = "time-speed-info";
  timeSpeedInfo.innerHTML = "x" + timeSpeedMultiplier;
  timeSpeedInfo.style.setProperty("font-weight", "700");
  timeSpeedOuter.appendChild(timeSpeedInfo);

  let controlsOuter = document.createElement("div");
  controlsOuter.id = "simulator-controls";
  controlsOuter.style.setProperty("text-align", "center");
  controlsOuter.style.setProperty("margin-top", ".5rem");
  controlsOuter.style.setProperty("display", "flex");
  controlsOuter.style.setProperty("align-items", "center");
  dom.appendChild(controlsOuter);

  let playButtonSpan = document.createElement("span");
  controlsOuter.appendChild(playButtonSpan);

  let pauseButtonSpan = document.createElement("span");
  pauseButtonSpan.style.setProperty("margin-left", ".6rem");
  controlsOuter.appendChild(pauseButtonSpan);

  let slowerButtonSpan = document.createElement("span");
  slowerButtonSpan.style.setProperty("margin-left", ".6rem");
  controlsOuter.appendChild(slowerButtonSpan);

  let fasterButtonSpan = document.createElement("span");
  fasterButtonSpan.style.setProperty("margin-left", ".6rem");
  controlsOuter.appendChild(fasterButtonSpan);

  let goToButtonSpan = document.createElement("span");
  goToButtonSpan.style.setProperty("margin-left", ".6rem");
  controlsOuter.appendChild(goToButtonSpan);

  let playButton = document.createElement("button");
  playButton.classList.add("btn", "btn", "custom-btn");
  playButton.innerHTML = "<i class='fas fa-play'></i>";
  playButton.onclick = onNormalSpeed;
  playButton.setAttribute("data-toggle", "tooltip");
  playButton.setAttribute("data-placement", "top");
  playButton.setAttribute("title", "Continue time at normal speed");
  playButtonSpan.appendChild(playButton);

  let slowerButton = document.createElement("button");
  slowerButton.classList.add("btn", "btn-sm", "custom-btn");
  slowerButton.innerHTML =
    "<img src='./images/turtle.png' width='20' height='20'></img>";
  slowerButton.onclick = onBackward;
  slowerButton.setAttribute("data-toggle", "tooltip");
  slowerButton.setAttribute("data-placement", "top");
  slowerButton.setAttribute("title", "Slower by 0.25");
  slowerButtonSpan.appendChild(slowerButton);

  let pauseButton = document.createElement("button");
  pauseButton.classList.add("btn", "btn-sm", "custom-btn");
  pauseButton.innerHTML =
    "<img src='./images/pause-time.png' width='20' height='20'></img>";
  pauseButton.onclick = onPauseTime;
  pauseButton.setAttribute("data-toggle", "tooltip");
  pauseButton.setAttribute("data-placement", "top");
  pauseButton.setAttribute("title", "Pause time");
  pauseButtonSpan.appendChild(pauseButton);

  let fasterButton = document.createElement("button");
  fasterButton.classList.add("btn", "btn-sm", "custom-btn");
  fasterButton.innerHTML =
    "<img src='./images/rabbit.png' width='20' height='20'></img>";
  fasterButton.onclick = onSpeedUpTime;
  fasterButton.setAttribute("data-toggle", "tooltip");
  fasterButton.setAttribute("data-placement", "top");
  fasterButton.setAttribute("title", "Faster by 0.25");
  fasterButtonSpan.appendChild(fasterButton);

  let goToButton = document.createElement("button");
  goToButton.classList.add("btn", "btn-sm", "custom-btn");
  goToButton.innerHTML =
    "<img src='./images/skip-time.png' width='20' height='20'></img>";
  goToButton.onclick = () => {
    document
      .querySelectorAll("#simulator-controls button")
      .forEach((x) => (x.disabled = true));
    goToOuter.style.setProperty("display", "inline-block");
    PauseSimulatedTime();
    timeInput.value = simulatedTime.format("HH:mm:ss");
    dateInput.value = simulatedTime.format("YYYY-MM-DD");
  };
  goToButton.setAttribute("data-toggle", "tooltip");
  goToButton.setAttribute("data-placement", "top");
  goToButton.setAttribute("title", "Go to specific time");
  goToButtonSpan.appendChild(goToButton);

  let goToOuter = document.createElement("div");
  goToOuter.style.setProperty("display", "none");
  dom.appendChild(goToOuter);

  let dateTitleOuter = document.createElement("div");
  dateTitleOuter.classList.add("input-group");
  // dateTitleOuter.style.setProperty("width", "91%");
  dateTitleOuter.style.setProperty("margin-top", ".5rem");

  goToOuter.appendChild(dateTitleOuter);

  let dateTitleDiv = document.createElement("div");
  dateTitleDiv.classList.add("input-group-prepend");
  dateTitleOuter.appendChild(dateTitleDiv);

  let dateTitle = document.createElement("span");
  dateTitle.classList.add("input-group-text");
  dateTitle.id = "date-title";
  dateTitle.style.setProperty("width", "4rem");
  dateTitle.innerHTML = "Day";
  dateTitleDiv.appendChild(dateTitle);

  let dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.id = "specific-date-input";
  dateInput.name = "specific-date-input";
  dateInput.classList.add("form-control");
  dateInput.setAttribute("aria-describedby", dateTitle.id);
  dateTitleOuter.appendChild(dateInput);

  let timeTitleOuter = document.createElement("div");
  timeTitleOuter.classList.add("input-group");
  // timeTitleOuter.style.setProperty("width", "91%");
  timeTitleOuter.style.setProperty("margin-top", ".5rem");
  goToOuter.appendChild(timeTitleOuter);

  let timeTitleDiv = document.createElement("div");
  timeTitleDiv.classList.add("input-group-prepend");
  timeTitleOuter.appendChild(timeTitleDiv);

  let timeTitle = document.createElement("span");
  timeTitle.classList.add("input-group-text");
  timeTitle.id = "date-title";
  timeTitle.innerHTML = "Time";
  timeTitle.style.setProperty("width", "4rem");
  timeTitleDiv.appendChild(timeTitle);

  let timeInput = document.createElement("input");
  timeInput.type = "time";
  timeInput.id = "specific-time-input";
  timeInput.name = "specific-time-input";
  timeInput.classList.add("form-control");
  timeInput.setAttribute("aria-describedby", timeTitle.id);
  timeInput.step = "1";
  timeTitleOuter.appendChild(timeInput);

  const HideGoToOuter = function () {
    goToOuter.style.setProperty("display", "none");
    // simulateTestOuter.style.setProperty("display", "block");
    document
      .querySelectorAll("#simulator-controls button")
      .forEach((x) => (x.disabled = false));
    // document
    //   .getElementById("analog-clock")
    //   .style.setProperty("margin-left", "3.4rem");
    NormalSimulatedTime();
    // PauseSimulatedTime();
  };

  let buttonsOuter = document.createElement("div");
  buttonsOuter.style.setProperty("margin-top", ".5rem");
  goToOuter.appendChild(buttonsOuter);

  let goButtonOuter = document.createElement("span");
  goButtonOuter.style.setProperty("float", "right");
  buttonsOuter.appendChild(goButtonOuter);

  let goButton = document.createElement("button");
  goButton.classList.add("btn", "btn-sm", "btn-info");
  goButton.innerHTML = "Go";
  goButton.style.setProperty("font-size", "0.9rem");
  goButton.style.setProperty("line-height", " 1.7");
  goButton.onclick = () => {
    onGoToSpecificTime(HideGoToOuter);
  };
  goButtonOuter.appendChild(goButton);

  let cancelButtonOuter = document.createElement("span");
  cancelButtonOuter.style.setProperty("float", "right");
  cancelButtonOuter.style.setProperty("margin-right", ".5rem");
  buttonsOuter.appendChild(cancelButtonOuter);

  let cancelButton = document.createElement("button");
  cancelButton.classList.add("btn", "btn-sm", "btn-secondary");
  cancelButton.style.setProperty("font-size", "0.9rem");
  cancelButton.style.setProperty("line-height", " 1.7");
  cancelButton.innerHTML = "Cancel";
  cancelButton.onclick = HideGoToOuter;
  cancelButtonOuter.appendChild(cancelButton);

  // let simulateTestOuter = document.createElement("div");
  // simulateTestOuter.style.setProperty("width", "100%");
  // simulateTestOuter.style.setProperty("margin-top", "2rem");
  // simulateTestOuter.style.setProperty("text-align", "center");
  // dom.appendChild(simulateTestOuter);

  // let simulateTestButton = document.createElement("button");
  // simulateTestButton.classList.add("btn", "btn-outline-info");
  // simulateTestButton.innerHTML = "Create test";
  // simulateTestButton.onclick = () => {
  //   CreateAndRenderCreateTestModal("create-test");
  // };
  // simulateTestOuter.appendChild(simulateTestButton);
};

const RefreshUiOnContinueTime = function () {
  if (document.getElementById("time-speed-title"))
    document
      .getElementById("time-speed-title")
      .style.setProperty("display", "initial");
  if (document.getElementById("time-speed-info"))
    document
      .getElementById("time-speed-info")
      .style.setProperty("color", "initial");
};

const UtilityClock = function (container) {
  var dynamic = container.querySelector(".dynamic");
  var hourElement = container.querySelector(".hour");
  var minuteElement = container.querySelector(".minute");
  var secondElement = container.querySelector(".second");

  var div = function (className, innerHTML) {
    var element = document.createElement("div");
    element.className = className;
    element.innerHTML = innerHTML || "";
    return element;
  };

  var append = function (element) {
    return {
      to: function (parent) {
        parent.appendChild(element);
        return append(parent);
      },
    };
  };

  var anchor = function (element, rotation) {
    var anchor = div("anchor");
    rotate(anchor, rotation);
    append(element).to(anchor).to(dynamic);
  };

  var minute = function (n) {
    var klass = n % 5 == 0 ? "major" : n % 1 == 0 ? "whole" : "part";
    var line = div("element minute-line " + klass);
    anchor(line, n);
    if (n % 5 == 0) {
      var text = div("anchor minute-text " + klass);
      var content = div("expand content", (n < 10 ? "0" : "") + n);
      append(content).to(text);
      rotate(text, -n);
      anchor(text, n);
    }
  };

  var hour = function (n) {
    var klass = "hour-item hour-" + n;
    var line = div("element hour-pill " + klass);
    anchor(line, n * 5);
    var text = div("anchor hour-text " + klass);
    var content = div("expand content", n);
    append(content).to(text);
    rotate(text, -n * 5);
    anchor(text, n * 5);
    return;
  };

  var position = function (element, phase, r) {
    var theta = phase * 2 * Math.PI;
    element.style.top = (-r * Math.cos(theta)).toFixed(1) + "px";
    element.style.left = (r * Math.sin(theta)).toFixed(1) + "px";
  };

  var rotate = function (element, second) {
    element.style.transform = element.style.webkitTransform =
      "rotate(" + second * 6 + "deg)";
  };

  var animate = function () {
    /* analog clock */
    var now = simulatedTime.toDate();
    var time =
      now.getHours() * 3600 +
      now.getMinutes() * 60 +
      now.getSeconds() * 1 +
      now.getMilliseconds() / 1000;
    rotate(secondElement, time);
    rotate(minuteElement, time / 60);
    rotate(hourElement, time / 60 / 12);

    requestAnimationFrame(animate);
  };

  for (var i = 1 / 4; i <= 60; i += 1 / 4) minute(i);
  for (var i = 1; i <= 12; i++) hour(i);

  RenderDigitalClock();
  animate();
};

const AutoResize = function (element, nativeSize) {
  var update = function () {
    var parent = element.offsetParent;
    var scale = Math.min(parent.offsetWidth, parent.offsetHeight) / nativeSize;
    element.style.transform = element.style.webkitTransform =
      "scale(" + scale.toFixed(3) + ")";
  };
  update();
  window.addEventListener("resize", update);
};

const RenderClocks = function () {
  var clock = document.getElementById("utility-clock");
  UtilityClock(clock);
  AutoResize(clock, 295 + 32);
};

const RenderDigitalClock = function () {
  var date = simulatedTime.toDate();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  var time = h + ":" + m + ":" + s;
  document.getElementById("digital-clock").innerText = time;
  document.getElementById("digital-clock").textContent = time;

  requestAnimationFrame(RenderDigitalClock);
};

const InitializeCalendar = function (selector) {
  let calendarRow = document.createElement("div");
  calendarRow.classList.add("row");
  calendarRow.classList.add("rounded");
  calendarRow.classList.add("p-2");
  calendarRow.id = "calendar-outer";
  calendarRow.style.setProperty("height", "24rem");
  calendarRow.style.setProperty("margin-top", "1rem");
  selector.appendChild(calendarRow);

  let calendarDiv = document.createElement("span");
  // calendarDiv.classList.add("col");
  calendarDiv.id = "calendar-container";
  calendarDiv.style.setProperty("max-height", "22rem");
  calendarDiv.style.setProperty("width", "20rem");
  calendarRow.appendChild(calendarDiv);

  calendar = new Calendar(
    "calendar-container",
    "small",
    ["Monday", 3],
    ["#ffc107", "#ffa000", "#ffffff", "#ffecb3"],
    {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      months: [
        "January",
        "Feburary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      indicator: true,
      indicator_type: 1,
      indicator_pos: "top",
      todayDate: simulatedTime.toDate(),
      // placeholder: "<span>Custom Placeholder</span>",
    }
  );
};

const InitializeOrganizerForCalendar = function () {
  let organizerDiv = document.createElement("span");
  organizerDiv.id = "organizer-container";
  organizerDiv.style.setProperty("max-height", "22rem");
  organizerDiv.style.setProperty("margin-left", "1rem");
  organizerDiv.style.setProperty("width", "22rem");
  document.getElementById("calendar-outer").appendChild(organizerDiv);

  organizer = new Organizer("organizer-container", calendar, {});
};

const InitializeActionsLog = function () {
  let loggerOuterDiv = document.createElement("span");
  loggerOuterDiv.id = "logger-outer";
  loggerOuterDiv.style.setProperty("max-height", "22rem");
  loggerOuterDiv.style.setProperty("margin-left", "1rem");
  loggerOuterDiv.style.setProperty("width", "23rem");
  document.getElementById("calendar-outer").appendChild(loggerOuterDiv);

  let loggerContainer = document.createElement("div");
  loggerContainer.id = "logger-container";
  loggerOuterDiv.appendChild(loggerContainer);

  let loggerHeader = document.createElement("div");
  loggerHeader.id = "logger-header";
  loggerHeader.innerHTML = "HISTORY";
  loggerContainer.appendChild(loggerHeader);

  let loggerBody = document.createElement("div");
  loggerBody.id = "logger-body";
  loggerContainer.appendChild(loggerBody);
};

const CreateDeviceBubbleForLog = function (
  name,
  icon,
  backgroundColor,
  actionText,
  callback
) {
  let logBubble = document.createElement("div");
  logBubble.classList.add("log-bubble");
  logBubble.style.backgroundColor = backgroundColor;
  logBubble.onclick = callback;

  document.getElementById("logger-body").appendChild(logBubble);

  let logBubbleInfo = document.createElement("div");
  logBubbleInfo.classList.add("log-bubble-info");
  logBubble.appendChild(logBubbleInfo);

  let logBubbleIconSpan = document.createElement("span");
  logBubbleIconSpan.style.cssFloat = "left";
  logBubbleInfo.appendChild(logBubbleIconSpan);

  let logBubbleIcon = document.createElement("img");
  logBubbleIcon.classList.add("log-bubble-icon");
  logBubbleIcon.width = 25;
  logBubbleIcon.height = 25;
  logBubbleIcon.src = icon;
  logBubbleIconSpan.appendChild(logBubbleIcon);

  let logBubbleName = document.createElement("span");
  logBubbleName.classList.add("log-bubble-name");
  logBubbleName.innerHTML = name;
  logBubbleInfo.appendChild(logBubbleName);

  let logBubbleTime = document.createElement("span");
  logBubbleTime.classList.add("log-bubble-time");
  logBubbleTime.innerHTML = simulatedTime.format("HH:mm:ss, DD/MM");
  logBubbleInfo.appendChild(logBubbleTime);

  let logBubbleText = document.createElement("div");
  logBubbleText.classList.add("log-bubble-text");
  logBubbleText.innerHTML = actionText;
  logBubble.appendChild(logBubbleText);
  UpdateScroll("logger-body");
};

const CreateStaticBubbleForLog = function (
  name,
  backgroundColor,
  actionText,
  callback
) {
  let logBubble = document.createElement("div");
  logBubble.classList.add("log-bubble");
  logBubble.style.backgroundColor = backgroundColor;
  logBubble.onclick = callback;
  document.getElementById("logger-body").appendChild(logBubble);

  let logBubbleInfo = document.createElement("div");
  logBubbleInfo.classList.add("log-bubble-info");
  logBubble.appendChild(logBubbleInfo);

  let logBubbleIconSpan = document.createElement("span");
  logBubbleIconSpan.style.cssFloat = "left";
  logBubbleInfo.appendChild(logBubbleIconSpan);

  let logBubbleIcon = document.createElement("img");
  logBubbleIcon.classList.add("log-bubble-icon");
  logBubbleIcon.width = 25;
  logBubbleIcon.height = 25;
  logBubbleIcon.src = "https://img.icons8.com/color/2x/blockly-pink.png";
  logBubbleIconSpan.appendChild(logBubbleIcon);

  let logBubbleName = document.createElement("span");
  logBubbleName.classList.add("log-bubble-name");
  logBubbleName.innerHTML = name;
  logBubbleInfo.appendChild(logBubbleName);

  let logBubbleTime = document.createElement("span");
  logBubbleTime.classList.add("log-bubble-time");
  logBubbleTime.innerHTML = simulatedTime.format("HH:mm:ss, DD/MM");
  logBubbleInfo.appendChild(logBubbleTime);

  let logBubbleText = document.createElement("div");
  logBubbleText.classList.add("log-bubble-text");
  logBubbleText.innerHTML = actionText;
  logBubble.appendChild(logBubbleText);
  UpdateScroll("logger-body");
};

const UpdateScroll = function (id) {
  var element = document.getElementById(id);

  if (element.scrollHeight - element.scrollTop <= element.clientHeight + 145)
    element.scrollTop = element.scrollHeight;
};

const InitializeSimulatedHistory = function (runTimeData) {
  let loggerOuterDiv = document.createElement("span");
  loggerOuterDiv.id = "simulated-actions-outer";
  loggerOuterDiv.style.setProperty("max-height", "22rem");
  loggerOuterDiv.style.setProperty("margin-left", "1rem");
  loggerOuterDiv.style.setProperty("width", "22rem");
  document.getElementById("calendar-outer").appendChild(loggerOuterDiv);

  let loggerContainer = document.createElement("div");
  loggerContainer.id = "simulated-actions-container";
  loggerOuterDiv.appendChild(loggerContainer);

  let loggerHeader = document.createElement("div");
  loggerHeader.id = "simulated-actions-header";
  loggerHeader.innerHTML = "TESTS CONTROL PANEL";
  // TODO: at the beginning no tests added
  loggerContainer.appendChild(loggerHeader);

  let loggerBody = document.createElement("div");
  loggerBody.id = "simulated-actions-body";
  loggerContainer.appendChild(loggerBody);

  let folderTestButton = document.createElement("div");
  folderTestButton.id = "folder-test-button";
  folderTestButton.onclick = () => {
    // CreateAndRenderCreateTestModal("create-test", envData);
    CreateAndRenderTestsModal(runTimeData.execData.title);
  };
  loggerContainer.appendChild(folderTestButton);

  let folderTestIcon = document.createElement("i");
  folderTestIcon.classList.add("fas", "fa-folder", "fa-lg");
  folderTestButton.appendChild(folderTestIcon);
};

const InitializeSmartDevicesContainer = function (selector) {
  let smartDevicesDiv = document.createElement("div");
  smartDevicesDiv.classList.add("row");
  smartDevicesDiv.id = "runtime-smart-devices-container";
  // smartDevicesDiv.style.backgroundColor = "#f1f1f1";
  smartDevicesDiv.style.overflowY = "auto";
  selector.appendChild(smartDevicesDiv);
};

const RenderSmartDevices = function (devicesOnAutomations) {
  let smartDeviceSelector = document.getElementById(
    "runtime-smart-devices-container"
  );

  devicesOnAutomations.forEach((device) => {
    let cardOutter = document.createElement("div");
    cardOutter.classList.add("ml-2");
    cardOutter.classList.add("mr-2");
    cardOutter.classList.add("runtime-cards");
    cardOutter.id = device.id + "-runtime-card";
    smartDeviceSelector.appendChild(cardOutter);

    Automatic_IoT_UI_Generator.RenderReadOnlyResource(cardOutter, device);
  });
};

const FocusOnUpdatedDevice = function (selectors) {
  selectors.forEach((sel) => sel.classList.add("runtime-cards-update"));
  setTimeout(function () {
    selectors.forEach((sel) => sel.classList.remove("runtime-cards-update"));
  }, 4000);
};

const RerenderDevice = function (device, propsDiff) {
  let deviceCol = document.getElementById(device.id + "-runtime-card");
  deviceCol.innerHTML = "";
  Automatic_IoT_UI_Generator.RenderReadOnlyResource(deviceCol, device);

  let propsSelectors = [];
  propsDiff.forEach((prop) =>
    propsSelectors.push(
      document.getElementById(device.id + "-" + prop.name + "-value")
    )
  );

  FocusOnUpdatedDevice(propsSelectors);
};
/* End UI for runtime environment */

export async function StartApplication(runTimeData) {
  try {
    devicesOnAutomations = CollectRegisteredDevices(
      runTimeData.execData.project.SmartObjects
    );

    debugTests =
      runTimeData.execData.project.SmartObjects[0].editorsData[0].generated
        .debugTests;

    // console.log(runTimeData);
    Initialize(runTimeData.UISelector, runTimeData);

    // Listen for messages
    RenderClocks();

    // Render Smart Devices
    RenderSmartDevices(devicesOnAutomations);

    const RunAutomations = async function (automations) {
      automations.forEach((events) => {
        if (
          events.options.find((option) => option.id === "starts_on_execution")
            .value === "Automatically"
        ) {
          let projectElementId = events.id;
          eval("(async () => { " + events.editorsData[0].generated + "})()");
        }
      });
    };

    // automations tasks
    RunAutomations(runTimeData.execData.project.AutomationTasks);

    // calendar tasks
    RunAutomations(runTimeData.execData.project.CalendarEvents);

    // conditional tasks
    RunAutomations(runTimeData.execData.project.ConditionalEvents);
  } catch (e) {
    alert(e);
  }
}

export async function StopApplication(execData) {
  alert("stop my application");
  arrayIntervals.forEach((elem) => {
    clearTimeout(elem.time);
  });
}

export async function PauseApplication(execData) {
  alert("pause my application");
}

export async function ContinueApplication(execData) {
  alert("continue my application");
}
