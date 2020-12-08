import { urlInfo } from "../../../../ide/ide-components/SmartObjectVPLEditor/iotivity-server-conf.js";

const AddThirdPartyLibs = function (environment) {
  environment.importJSLib(
    "./src/app/application-domain-frameworks/domains-vpl-conf/IoT/third-party-libs/dayjs.min.js"
  );

  // environment.importJSLib(
  //   "https://polyfill.io/v3/polyfill.min.js?features=Array.from,Promise,Symbol,Object.setPrototypeOf,Object.getOwnPropertySymbols,Set"
  // );

  // environment.importJSLib("https://cdn.jsdelivr.net/npm/superagent");
};

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

const Initialize = function () {
  dayjs().format();
};

/* Start data and functions for calendar - conditional blocks */
const arrayIntervals = []; // {type: <blockType>, time: SetTimeout, func: Function (for recursive)}

const whenCondData = [];

const changesData = [];

const StartWhenTimeout = function () {
  let index = arrayIntervals.length;
  arrayIntervals.push({ type: "when_cond" });
  let f = function () {
    arrayIntervals[index].time = setTimeout(() => {
      if (whenCondData.length === 0) {
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

const TakeDifferenceFromSpecificTime = function (time) {
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

  return ms;
};

const TakeDifferenceFromSpecificDay = function (time) {
  let intDay = weekDays.indexOf(time.day);

  let futureDate = dayjs().day(intDay);
  let ms = futureDate.diff(dayjs());

  if (ms <= 0) {
    futureDate = dayjs().day(7 + intDay);
    ms = futureDate.diff(dayjs());
  }

  return ms;
};

const TakeDifferenceFromSpecificMonth = function (time) {
  let intMonth = months.indexOf(time.month);

  let futureDate = dayjs().month(intMonth);
  let ms = futureDate.diff(dayjs());

  if (ms <= 0) {
    futureDate = dayjs().month(12 + intMonth);
    ms = futureDate.diff(dayjs());
  }

  return ms;
};

const EverySecond = function (time) {
  return time.second * 1000;
};

const EveryMinute = function (time) {
  return time.minute * 60000;
};

const EveryHour = function (time) {
  return time.hour * 3600000;
};

const EveryDay = function (time) {
  return time.day * 86400000;
};

const EveryMonth = function (time) {
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
/* End data and functions for calendar - conditional blocks */

export async function StartApplication(data) {
  try {
    AddThirdPartyLibs(data.runtimeEnvironment);

    // return {devicesIDsForGetRequest, devicesIDs} the first to construct Get query
    let devicesIDsObject = CollectRegisteredDevices(
      data.execData.project.SmartObjects
    );

    // Open socket connection with iotivity
    Initialize();

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
            let data = JSON.parse(event.data);
            switch (data.type) {
              case "update":
                // TODO: replace new resource with the old one

                break;

              default:
                break;
            }

            console.log(data.resource);
          }
        });

        // calendar tasks
        data.execData.project.CalendarEvents.forEach((events) => {
          eval("(async () => {" + events.editorsData[0].generated + "})()");
        });

        // conditional tasks
        data.execData.project.ConditionalEvents.forEach((events) => {
          eval("(async () => {" + events.editorsData[0].generated + "})()");
        });

        // Start whenConditions
        StartWhenTimeout();
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
