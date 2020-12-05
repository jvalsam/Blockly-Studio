import { urlInfo } from "../../../../ide/ide-components/SmartObjectVPLEditor/iotivity-server-conf.js";

const AddThirdPartyLibs = function (environment) {
  environment.importJSLib(
    "./src/app/application-domain-frameworks/domains-vpl-conf/IoT/third-party-libs/dayjs.min.js"
  );

  environment.importJSLib(
    "https://polyfill.io/v3/polyfill.min.js?features=Array.from,Promise,Symbol,Object.setPrototypeOf,Object.getOwnPropertySymbols,Set"
  );

  environment.importJSLib(
    "./src/app/application-domain-frameworks/domains-vpl-conf/IoT/third-party-libs/superagent.min.js"
  );
};

/**
 * @param {string} url
 * @param {callback} callback
 * @description GET Request
 */
const GetRequest = (url, callback) => {
  superagent
    .get(url)
    .set("accept", "json")
    .end((err, res) => {
      return callback(err, res);
    });
};

const InitializeData = function () {
  dayjs().format();
};

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

export async function StartApplication(data) {
  // try {
  //   // get info for smart objects
  //   // data.execData.project.SmartObjects;
  //   // data.execData.project.SmartObjects[0].editorsData[0].generated.details
  //   //   .iotivityResourceID;

  //   AddThirdPartyLibs(data.runtimeEnvironment);
  //   InitializeData();

  //   // calendar tasks
  //   data.execData.project.CalendarEvents.forEach((events) => {
  //     eval(events.editorsData[0].generated);
  //   });

  //   // conditional tasks
  //   data.execData.project.ConditionalEvents.forEach((events) => {
  //     eval(events.editorsData[0].generated);
  //   });

  //   // Start whenConditions
  //   StartWhenTimeout();
  // } catch (e) {
  //   alert(e);
  // }

  setInterval(() => {
    console.log("execution...\n");
    data.checkRuntimeEnvironment();
  }, 1000);
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
