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
  InitializeSimulatedTime();

  InitializeCalendar(selector);
  InitializeOrganizerForCalendar();
  InitializeActionsLog();
  InitializeClocks(document.getElementById("calendar-outter"), () => {
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

  AddTimeInSimulatedTable(futureTime);

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

  AddTimeInSimulatedTable(futureDate);

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

  AddTimeInSimulatedTable(futureDate);

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

  AddTimeInSimulatedTable(futureDate);

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

  AddTimeInSimulatedTable(futureDate);

  return futureDate;
};

const EveryHour = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate;
  if (startTime) futureDate = startTime;
  else futureDate = dayjs(simulatedTime).hour(simulatedTime.hour() + time.hour);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate);

  return futureDate;
};

const EveryDay = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate = dayjs(simulatedTime).day(simulatedTime.day() + time.day);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate);

  return futureDate;
};

const EveryMonth = function (time, calendarInfo, calendarBlockId, startTime) {
  let futureDate = dayjs(simulatedTime).month(
    simulatedTime.month() + time.month
  );

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  AddTimeInSimulatedTable(futureDate);

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
  // SpeedUpSimulatedTime();
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
};

const SpeedUpSimulatedTime = function () {
  timeFunc = setInterval(() => {
    simulatedTime = dayjs(simulatedTime).set(
      "millisecond",
      simulatedTime.millisecond() + timeSpeedInSpeedUp
    );
    // TODO: update calendar
  }, nowTimeSpeed);
};

const PauseSimulatedTime = function () {
  clearInterval(timeFunc);
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

const AddTimeInSimulatedTable = function (time) {
  if (!simulatedTimeTable.includes(time)) simulatedTimeTable.push(time);
  simulatedTimeTable.sort(compareTimes);
};

const compareTimes = function (a, b) {
  // Use toUpperCase() to ignore character casing
  const timeA = a;
  const timeB = b;

  let comparison = 0;
  if (timeA.diff(timeB) > 0) {
    comparison = 1;
  } else if (timeA.diff(timeB) < 0) {
    comparison = -1;
  }
  return comparison;
};
/* End of functions for simulating time */

/* Start UI for runtime environment */
const InitializeClocks = function (selector, onComplete) {
  let outerClockDiv = document.createElement("div");
  // outerClockDiv.style.setProperty("float", "right");
  // outerClockDiv.style.setProperty("max-width", "10rem");
  selector.appendChild(outerClockDiv);

  let digitalClock = document.createElement("div");
  digitalClock.id = "digital-clock";
  digitalClock.style.setProperty("margin-top", ".5rem");
  outerClockDiv.appendChild(digitalClock);

  let fill = document.createElement("div");
  fill.classList.add("fill");
  fill.style.setProperty("width", "130px");
  fill.style.setProperty("height", "130px");
  fill.style.setProperty("margin-left", "3.3rem");
  outerClockDiv.appendChild(fill);

  InitializeSimulatorControls({
    dom: outerClockDiv,
    onNormalSpeed: () => {
      PauseSimulatedTime();
      NormalSimulatedTime();
      RefreshUiOnContinueTime();
      document.getElementById("time-speed-info").innerHTML =
        "x" + timeSpeedMultiplier;
    },
    onPauseTime: () => {
      PauseSimulatedTime();
      document
        .getElementById("time-speed-title")
        .style.setProperty("display", "none");
      document.getElementById("time-speed-info").innerHTML = "Paused";
      document
        .getElementById("time-speed-info")
        .style.setProperty("color", "#ff9966");
    },
    onBackward: () => {
      if (timeSpeedMultiplier > 0.25) {
        timeSpeedMultiplier = timeSpeedMultiplier - 0.25;
        nowTimeSpeed = timeSpeedInSpeedUp / timeSpeedMultiplier;
      }
      PauseSimulatedTime();
      if (timeSpeedMultiplier === 1) NormalSimulatedTime();
      else SpeedUpSimulatedTime();
      document.getElementById("time-speed-info").innerHTML =
        "x" + timeSpeedMultiplier;
      RefreshUiOnContinueTime();
    },
    onSpeedUpTime: () => {
      if (timeSpeedMultiplier < 8) {
        timeSpeedMultiplier = timeSpeedMultiplier + 0.25;
        nowTimeSpeed = timeSpeedInSpeedUp / timeSpeedMultiplier;
      }
      PauseSimulatedTime();
      if (timeSpeedMultiplier === 1) NormalSimulatedTime();
      else SpeedUpSimulatedTime();
      document.getElementById("time-speed-info").innerHTML =
        "x" + timeSpeedMultiplier;
      RefreshUiOnContinueTime();
    },
    onGoToSpecificTime: () => {},
  });

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
  controlsOuter.style.setProperty("align-items", "flex-end");
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

  // let goToOuter = document.createElement("div");
  // goToOuter.style.setProperty("padding-top", ".3rem");
  // goToOuter.style.setProperty("margin-top", ".7rem");
  // // goToOuter.style.setProperty("text-align", "left");
  // goToOuter.style.setProperty("border-top", "solid 1px #0000004a");
  // controlsOuter.appendChild(goToOuter);

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
  goToButton.onclick = onSpeedUpTime;
  goToButton.setAttribute("data-toggle", "tooltip");
  goToButton.setAttribute("data-placement", "top");
  goToButton.setAttribute("title", "Go to specific time");
  goToButtonSpan.appendChild(goToButton);

  // let dateLabel = document.createElement("label");
  // dateLabel.setAttribute("for", "specific-date-input");
  // dateLabel.innerHTML = "Day: ";
  // dateLabel.style.setProperty("display", "none");
  // goToOuter.appendChild(dateLabel);

  // let dateInput = document.createElement("input");
  // dateInput.type = "date";
  // dateInput.id = "specific-date-input";
  // dateInput.name = "specific-date-input";
  // dateInput.classList.add("form-control");
  // dateInput.value = simulatedTime.format("YYYY-MM-DD");
  // dateInput.style.setProperty("display", "none");
  // goToOuter.appendChild(dateInput);

  // let timeLabel = document.createElement("label");
  // timeLabel.setAttribute("for", "specific-time-input");
  // timeLabel.innerHTML = "Time: ";
  // timeLabel.style.setProperty("margin-top", ".5rem");
  // timeLabel.style.setProperty("display", "none");
  // goToOuter.appendChild(timeLabel);

  // let timeInput = document.createElement("input");
  // timeInput.type = "time";
  // timeInput.id = "specific-time-input";
  // timeInput.name = "specific-time-input";
  // timeInput.classList.add("form-control");
  // timeInput.value = simulatedTime.format("HH:mm:ss");
  // timeInput.step = "1";
  // timeInput.style.setProperty("display", "none");
  // goToOuter.appendChild(timeInput);

  // let goToButtonOuter = document.createElement("div");
  // // goToButtonOuter.style.setProperty("text-align", "right");
  // goToOuter.appendChild(goToButtonOuter);

  // let goToSpecificDateButton = document.createElement("button");
  // goToSpecificDateButton.classList.add("btn", "btn-info");
  // goToSpecificDateButton.innerHTML = "Set simulated time";
  // goToSpecificDateButton.style.setProperty("margin-top", ".5rem");
  // goToButtonOuter.appendChild(goToSpecificDateButton);

  // let goButton = document.createElement("button");
  // goButton.classList.add("btn", "btn-info");
  // goButton.innerHTML = "Go";
  // goButton.style.setProperty("margin-top", ".5rem");
  // goButton.style.setProperty("display", "none");
  // goToButtonOuter.appendChild(goButton);
};

const RefreshUiOnContinueTime = function () {
  document
    .getElementById("time-speed-title")
    .style.setProperty("display", "initial");
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
  calendarRow.id = "calendar-outter";
  selector.appendChild(calendarRow);

  let calendarDiv = document.createElement("span");
  calendarDiv.classList.add("col-3");
  calendarDiv.id = "calendar-container";
  calendarDiv.style.setProperty("max-height", "22rem");
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
  organizerDiv.classList.add("col-4");
  organizerDiv.id = "organizer-container";
  organizerDiv.style.setProperty("max-height", "22rem");
  document.getElementById("calendar-outter").appendChild(organizerDiv);

  organizer = new Organizer("organizer-container", calendar, {});
};

const InitializeActionsLog = function () {
  let loggerOutterDiv = document.createElement("span");
  loggerOutterDiv.classList.add("col");
  loggerOutterDiv.id = "logger-outter";
  loggerOutterDiv.style.setProperty("max-height", "22rem");
  document.getElementById("calendar-outter").appendChild(loggerOutterDiv);

  let loggerContainer = document.createElement("div");
  loggerContainer.id = "logger-container";
  loggerOutterDiv.appendChild(loggerContainer);

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
