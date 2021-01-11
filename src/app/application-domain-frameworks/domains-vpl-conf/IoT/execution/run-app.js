let calendar,
  organizer,
  calendarData = {};

const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

const InitDevice = function (smartDevice) {
  return {
    id: smartDevice.editorsData[0].generated.details.iotivityResourceID,
    name: smartDevice.title,
    options: {
      image: smartDevice.img,
    },
    properties: smartDevice.editorsData[0].generated.details.properties,
    actions: smartDevice.editorsData[0].generated.details.actions,
    actionsDebugConfigurations:
      smartDevice.editorsData[0].generated.details.actionsDebugConfigurations,
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

const Initialize = function (selector) {
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
  InitializeSimulatedHistory();
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
      } else if (specificDate.diff(simulatedTimeTable[0].time) < 0) {
      } else {
        // jump to specific date but with simulatedTimeTable
        for (const [index, element] of simulatedTimeTable.entries()) {
          if (specificDate.diff(element.time) < 0) {
            simulatedTime = element.time;
            // set a boolean to go next time in simulatedTimeTable
            while (!element.finished) {}
          } else {
            break;
          }
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

const StartWhenTimeout = function () {
  let index = arrayIntervals.length;
  arrayIntervals.push({ type: "when_cond" });
  let f = function () {
    arrayIntervals[index].time = setTimeout(() => {
      if (whenCondData.length === 0) {
        clearTimeout(arrayIntervals[index].time);
        arrayIntervals.slice(index, 1);
        return;
      }
      whenCondData.forEach((cond) => {
        cond.func();
      });
      arrayIntervals[index].func();
    }, 500);
  };
  arrayIntervals[index].func = f;
  arrayIntervals[index].func();
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
  PinEventInCalendar(futureTime, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureTime, calendarBlockId);

  return futureTime;
};

const TakeDifferenceFromSpecificDay = function (
  time,
  calendarInfo,
  calendarBlockId,
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

  AddTimeInSimulatedTable(futureDate, calendarBlockId);

  return futureDate;
};

const TakeDifferenceFromSpecificMonth = function (
  time,
  calendarInfo,
  calendarBlockId,
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

  AddTimeInSimulatedTable(futureDate, calendarBlockId);

  return futureDate;
};

const EverySecond = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate;
  if (startTime) futureDate = startTime;
  else
    futureDate = dayjs(simulatedTime).second(
      simulatedTime.second() + time.second
    );

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate, calendarBlockId);

  return futureDate;
};

const EveryMinute = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate;
  if (startTime) futureDate = startTime;
  else
    futureDate = dayjs(simulatedTime).minute(
      simulatedTime.minute() + time.minute
    );

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate, calendarBlockId);

  return futureDate;
};

const EveryHour = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate;
  if (startTime) futureDate = startTime;
  else futureDate = dayjs(simulatedTime).hour(simulatedTime.hour() + time.hour);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate, calendarBlockId);

  return futureDate;
};

const EveryDay = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate = dayjs(simulatedTime).day(simulatedTime.day() + time.day);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate, calendarBlockId);

  return futureDate;
};

const EveryMonth = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate = dayjs(simulatedTime).month(
    simulatedTime.month() + time.month
  );

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate, calendarBlockId);

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
  timeFunc;

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

const AddTimeInSimulatedTable = function (time, id) {
  simulatedTimeTable.push({ time: time, id: id, finished: false });
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

const CreateAndRenderModal = function (idPrefix) {
  CreateModal(idPrefix);

  $("#" + idPrefix + "-modal").on("hidden.bs.modal", function (e) {
    DestroyModal(idPrefix);
  });

  $("#" + idPrefix + "-modal").modal("show");
};

const ClearModal = function (idPrefix) {
  document.getElementById(idPrefix + "-modal-title").innerHTML = "";
  document.getElementById(idPrefix + "-modal-body").innerHTML = "";
  document.getElementById(idPrefix + "-modal-cancel-button").innerHTML =
    "Cancel";
  document.getElementById(idPrefix + "-modal-confirm-button").innerHTML =
    "Confirm";
};

const DestroyModal = function (idPrefix) {
  document.getElementById(idPrefix + "-modal").remove();
};

/* End of functions for simulating time */

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
  playButton.classList.add("btn", "btn", "btn-info");
  playButton.innerHTML = "<i class='fas fa-play'></i>";
  playButton.onclick = onNormalSpeed;
  playButton.setAttribute("data-toggle", "tooltip");
  playButton.setAttribute("data-placement", "top");
  playButton.setAttribute("title", "Continue time at normal speed");
  playButtonSpan.appendChild(playButton);

  let slowerButton = document.createElement("button");
  slowerButton.classList.add("btn", "btn-sm", "btn-info");
  slowerButton.innerHTML =
    "<img src='./images/turtle.png' width='20' height='20'></img>";
  slowerButton.onclick = onBackward;
  slowerButton.setAttribute("data-toggle", "tooltip");
  slowerButton.setAttribute("data-placement", "top");
  slowerButton.setAttribute("title", "Slower by 0.25");
  slowerButtonSpan.appendChild(slowerButton);

  let pauseButton = document.createElement("button");
  pauseButton.classList.add("btn", "btn-sm", "btn-info");
  pauseButton.innerHTML =
    "<img src='./images/pause-time.png' width='20' height='20'></img>";
  pauseButton.onclick = onPauseTime;
  pauseButton.setAttribute("data-toggle", "tooltip");
  pauseButton.setAttribute("data-placement", "top");
  pauseButton.setAttribute("title", "Pause time");
  pauseButtonSpan.appendChild(pauseButton);

  let fasterButton = document.createElement("button");
  fasterButton.classList.add("btn", "btn-sm", "btn-info");
  fasterButton.innerHTML =
    "<img src='./images/rabbit.png' width='20' height='20'></img>";
  fasterButton.onclick = onSpeedUpTime;
  fasterButton.setAttribute("data-toggle", "tooltip");
  fasterButton.setAttribute("data-placement", "top");
  fasterButton.setAttribute("title", "Faster by 0.25");
  fasterButtonSpan.appendChild(fasterButton);

  let goToButton = document.createElement("button");
  goToButton.classList.add("btn", "btn-sm", "btn-info");
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
  };

  let buttonsOuter = document.createElement("div");
  buttonsOuter.style.setProperty("margin-top", ".5rem");
  goToOuter.appendChild(buttonsOuter);

  let goButtonOuter = document.createElement("span");
  goButtonOuter.style.setProperty("float", "right");
  buttonsOuter.appendChild(goButtonOuter);

  let goButton = document.createElement("button");
  goButton.classList.add("btn", "btn-info");
  goButton.innerHTML = "Go";
  goButton.onclick = () => {
    onGoToSpecificTime(HideGoToOuter);
  };
  goButtonOuter.appendChild(goButton);

  let cancelButtonOuter = document.createElement("span");
  cancelButtonOuter.style.setProperty("float", "right");
  cancelButtonOuter.style.setProperty("margin-right", ".5rem");
  buttonsOuter.appendChild(cancelButtonOuter);

  let cancelButton = document.createElement("button");
  cancelButton.classList.add("btn", "btn-secondary");
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
  //   CreateAndRenderModal("create-test");
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

const InitializeSimulatedHistory = function () {
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
    let devicesOnAutomations = CollectRegisteredDevices(
      runTimeData.execData.project.SmartObjects
    );

    Initialize(runTimeData.UISelector);

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

    // // conditional tasks
    // RunAutomations(runTimeData.execData.project.ConditionalEvents);

    // Start whenConditions
    // StartWhenTimeout();
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
