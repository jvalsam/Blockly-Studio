import { urlInfo } from "../../../../ide/ide-components/SmartObjectVPLEditor/iotivity-server-conf.js";

let calendar,
  organizer,
  calendarData = {};

async function GetRequest(url = "") {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function PostRequest(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const CollectRegisteredDevices = function (smartObjects) {
  const returnObject = { devicesIDsForGetRequest: [], devicesIDs: [] };

  smartObjects.forEach((so) => {
    // for GET query
    returnObject.devicesIDsForGetRequest.push([
      so.editorsData[0].generated.details.iotivityResourceID,
      "",
    ]);

    // for registered devices
    returnObject.devicesIDs.push(
      so.editorsData[0].generated.details.iotivityResourceID
    );
  });

  return returnObject;
};

const InitializeSocketConnection = function (onSuccess) {
  // Create WebSocket connection.
  const socket = new WebSocket("ws://" + urlInfo.iotivityUrl);

  /* Add function for validate JSON.parse */
  socket.isJsonString = function (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  // Connection opened
  socket.addEventListener("open", function (event) {
    onSuccess(socket);
  });
};

const StartObserving = function (socket, devicesIDs) {
  let dataToSend = { type: "start_observe", resources: devicesIDs };
  socket.send(JSON.stringify(dataToSend));
};

const Initialize = function (selector) {
  dayjs().format();
  InitializeClocks(selector);

  InitializeCalendar(selector);
  InitializeOrganizerForCalendar();
  InitializeSmartDevicesContainer(selector);
};

/* Start data and functions for calendar - conditional blocks */
const timeIdsToDate = {}; //  <id>: { day: "December 14, 2020", startTime: "16:54:33" }
const activeDateOnCalendar = {}; // "December 14, 2020": [ {startTime:"16:54:33", isFired: false } ]

const arrayIntervals = []; // {type: <blockType>, time: SetTimeout, func: Function (for recursive)}

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
    }, 400);
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
  calendarBlockId
) {
  let futureTime = dayjs()
    .set("second", time.second)
    .set("minute", time.minute)
    .set("hour", time.hour);

  let ms = futureTime.diff(dayjs());

  if (ms <= 0) {
    futureTime = dayjs()
      .set("second", time.second)
      .set("minute", time.minute)
      .set("hour", time.hour)
      .set("day", dayjs().day() + 1);
    ms = futureTime.diff(dayjs());
  }

  // Pin in calendar
  PinEventInCalendar(futureTime, calendarInfo, calendarBlockId);

  return ms;
};

const TakeDifferenceFromSpecificDay = function (
  time,
  calendarInfo,
  calendarBlockId
) {
  let intDay = weekDays.indexOf(time.day);

  let futureDate = dayjs().day(intDay);
  let ms = futureDate.diff(dayjs());

  if (ms <= 0) {
    futureDate = dayjs().day(7 + intDay);
    ms = futureDate.diff(dayjs());
  }

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  return ms;
};

const TakeDifferenceFromSpecificMonth = function (
  time,
  calendarInfo,
  calendarBlockId
) {
  let intMonth = months.indexOf(time.month);

  let futureDate = dayjs().month(intMonth);
  let ms = futureDate.diff(dayjs());

  if (ms <= 0) {
    futureDate = dayjs().month(12 + intMonth);
    ms = futureDate.diff(dayjs());
  }

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  return ms;
};

const EverySecond = function (time, calendarInfo, calendarBlockId) {
  let futureDate = dayjs().second(dayjs().second() + time.second);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);
  return time.second * 1000;
};

const EveryMinute = function (time, calendarInfo, calendarBlockId) {
  let futureDate = dayjs().minute(dayjs().minute() + time.minute);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  return time.minute * 60000;
};

const EveryHour = function (time, calendarInfo, calendarBlockId) {
  let futureDate = dayjs().hour(dayjs().hour() + time.hour);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  return time.hour * 3600000;
};

const EveryDay = function (time, calendarInfo, calendarBlockId) {
  let futureDate = dayjs().day(dayjs().day() + time.day);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  return time.day * 86400000;
};

const EveryMonth = function (time, calendarInfo, calendarBlockId) {
  let futureDate = dayjs().month(dayjs().month() + time.month);

  // Pin in calendar
  PinEventInCalendar(futureDate, calendarInfo, calendarBlockId);

  return time.month * 2592000000;
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
    isFired: false,
  });

  // sort the activeDateOnCalendar for specific day
  activeDateOnCalendar[dateToSave].sort(compareStartingDate);

  /* Merge new calendar data with the existing ones */
  calendarData = deepmerge(calendarData, data);

  /* Sorting calendar data */
  calendarData[year][month][date].sort(compareStartingDate);

  organizer.updateData(calendarData);
};
/* End data and functions for calendar - conditional blocks */

/* Start UI for runtime environment */
const InitializeClocks = function (selector) {
  let outterClockDiv = document.createElement("div");
  outterClockDiv.style.cssFloat = "right";
  selector.appendChild(outterClockDiv);

  let fill = document.createElement("div");
  fill.classList.add("fill");
  fill.style.width = "130px";
  fill.style.height = "130px";
  outterClockDiv.appendChild(fill);

  let digitalClock = document.createElement("div");
  digitalClock.id = "digital-clock";
  outterClockDiv.appendChild(digitalClock);

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
};

function utilityClock(container) {
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
    var now = new Date();
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
}

function autoResize(element, nativeSize) {
  var update = function () {
    var parent = element.offsetParent;
    var scale = Math.min(parent.offsetWidth, parent.offsetHeight) / nativeSize;
    element.style.transform = element.style.webkitTransform =
      "scale(" + scale.toFixed(3) + ")";
  };
  update();
  window.addEventListener("resize", update);
}

const RenderClocks = function () {
  var clock = document.getElementById("utility-clock");
  utilityClock(clock);
  autoResize(clock, 295 + 32);
};

const RenderDigitalClock = function () {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  var time = h + ":" + m + ":" + s;
  document.getElementById("digital-clock").innerText = time;
  document.getElementById("digital-clock").textContent = time;

  setTimeout(RenderDigitalClock, 1000);
};

const InitializeCalendar = function (selector) {
  let calendarRow = document.createElement("div");
  calendarRow.classList.add("row");
  calendarRow.classList.add("rounded");
  calendarRow.classList.add("p-2");
  calendarRow.id = "calendar-outter";
  selector.appendChild(calendarRow);

  let calendarDiv = document.createElement("span");
  calendarDiv.classList.add("col");
  calendarDiv.id = "calendar-container";
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
      // placeholder: "<span>Custom Placeholder</span>",
    }
  );
};

const InitializeOrganizerForCalendar = function () {
  let organizerDiv = document.createElement("span");
  organizerDiv.classList.add("col");
  organizerDiv.id = "organizer-container";
  document.getElementById("calendar-outter").appendChild(organizerDiv);

  organizer = new Organizer("organizer-container", calendar, {});

  $("body").on("DOMSubtreeModified", "#organizer-container-list", function () {
    // take day
    let day = document.getElementById("organizer-container-date").innerHTML;

    console.log(activeDateOnCalendar[day]);

    // parse the date and take which event is marked as fired
    if (activeDateOnCalendar[day]) {
      for (let i = 0; i < activeDateOnCalendar[day].length; ++i) {
        if (activeDateOnCalendar[day][i].isFired) {
          // add green border to show that the event is fired
          if (document.getElementById("organizer-container-list-item-" + i)) {
            if (
              !document
                .getElementById("organizer-container-list-item-" + i)
                .classList.contains("calendar-event-finished")
            )
              document
                .getElementById("organizer-container-list-item-" + i)
                .classList.add("calendar-event-finished");
          }
        }
      }
    }
  });
};

const InitializeSmartDevicesContainer = function (selector) {
  let smartDevicesDiv = document.createElement("div");
  smartDevicesDiv.classList.add("row");
  smartDevicesDiv.id = "runtime-smart-devices-container";
  smartDevicesDiv.style.backgroundColor = "#f1f1f1";
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

/* Start functionality for smart devices */
let MergeNameOfSmartObjectWithResource = function (so, resource) {
  // Merge all we need
  resource.name = so.editorsData[0].generated.title;
};

let MergeNameOfSmartObjectsWithResources = function (smartObjects, resources) {
  smartObjects.forEach((so) => {
    // find resource
    let device = resources.find(
      (resource) =>
        resource.id === so.editorsData[0].generated.details.iotivityResourceID
    );

    if (device) device.name = so.editorsData[0].generated.title;
  });
};
/* End functionality for smart devices */

export async function StartApplication(runTimeData) {
  try {
    // return {devicesIDsForGetRequest, devicesIDs} the first to construct Get query
    let devicesIDsObject = CollectRegisteredDevices(
      runTimeData.execData.project.SmartObjects
    );

    Initialize(runTimeData.UISelector);

    // Construct request to get the registered devices
    var url = new URL("http://" + urlInfo.iotivityUrl + "/resources");
    url.search = new URLSearchParams(
      devicesIDsObject.devicesIDsForGetRequest
    ).toString();

    // Get registered devices from iotivity
    GetRequest(url).then((responseData) => {
      // data.resources
      const devicesOnAutomations = responseData.resources;

      // open socket connection
      InitializeSocketConnection((socket) => {
        // Start Observing
        StartObserving(socket, devicesIDsObject.devicesIDs);

        // Listen for messages
        socket.addEventListener("message", function (event) {
          if (socket.isJsonString(event.data)) {
            let socketData = JSON.parse(event.data);
            switch (socketData.type) {
              case "update":
                let oldDeviceIndex = devicesOnAutomations.findIndex(
                  (elem) => elem.id === socketData.resource.id
                );
                // find smart object
                let smartObject = runTimeData.execData.project.SmartObjects.find(
                  (so) =>
                    devicesOnAutomations[oldDeviceIndex].id ===
                    so.editorsData[0].generated.details.iotivityResourceID
                );
                // merge smart object with resource to avoid update
                MergeNameOfSmartObjectWithResource(
                  smartObject,
                  socketData.resource
                );

                // replace old resource with the new one
                if (
                  !_.isEqual(
                    socketData.resource,
                    devicesOnAutomations[oldDeviceIndex]
                  )
                ) {
                  // find property difference
                  let propsDiff = socketData.resource.properties.filter(
                    (x) =>
                      !devicesOnAutomations[oldDeviceIndex].properties
                        .map((y) => y.value)
                        .includes(x.value)
                  );

                  devicesOnAutomations[oldDeviceIndex] = socketData.resource;

                  // Merge name into resource for rendering
                  MergeNameOfSmartObjectWithResource(
                    smartObject,
                    devicesOnAutomations[oldDeviceIndex]
                  );

                  // render device
                  RerenderDevice(
                    devicesOnAutomations[oldDeviceIndex],
                    propsDiff
                  );
                }
                break;

              case "start_observe_response":
                RenderClocks();

                // RenderDigitalClock();

                MergeNameOfSmartObjectsWithResources(
                  runTimeData.execData.project.SmartObjects,
                  devicesOnAutomations
                );

                // Render Smart Devices
                RenderSmartDevices(devicesOnAutomations);

                // automations tasks
                runTimeData.execData.project.AutomationTasks.forEach(
                  (events) => {
                    eval(
                      "(async () => { " +
                        events.editorsData[0].generated +
                        "})()"
                    );
                  }
                );

                // calendar tasks
                runTimeData.execData.project.CalendarEvents.forEach(
                  (events) => {
                    eval(
                      "(async () => {" +
                        events.editorsData[0].generated +
                        "})()"
                    );
                  }
                );

                // conditional tasks
                runTimeData.execData.project.ConditionalEvents.forEach(
                  (events) => {
                    eval(
                      "(async () => {" +
                        events.editorsData[0].generated +
                        "})()"
                    );
                  }
                );

                // Start whenConditions
                StartWhenTimeout();
                break;

              default:
                break;
            }
          }
        });
      });
    });
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
