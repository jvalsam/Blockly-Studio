dayjs().format();

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
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

let TakeDifferenceFromSpecificTime = function (time) {
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

let TakeDifferenceFromSpecificDay = function (time) {
  let intDay = weekDays.indexOf(time.day);

  let futureDate = dayjs().day(intDay);
  let ms = futureDate.diff(dayjs());

  if (ms <= 0) {
    futureDate = dayjs().day(7 + intDay);
    ms = futureDate.diff(dayjs());
  }

  return ms;
};

let TakeDifferenceFromSpecificMonth = function (time) {
  let intMonth = months.indexOf(time.month);

  let futureDate = dayjs().month(intMonth);
  let ms = futureDate.diff(dayjs());

  if (ms <= 0) {
    futureDate = dayjs().month(12 + intMonth);
    ms = futureDate.diff(dayjs());
  }

  return ms;
};

let differencesDispatch = {
  specificTime: TakeDifferenceFromSpecificTime,
  specificDay: TakeDifferenceFromSpecificDay,
  specificMonth: TakeDifferenceFromSpecificMonth,
};

export async function StartApplication(data) {
  //   alert("run my application");
  // data.execData.project{AutomationTasks[], CalendarEvents[].editorsData[].generated, ConditionalEvents[]}
  try {
    eval(data.execData.project.CalendarEvents[0].editorsData[0].generated);
  } catch (e) {
    alert(e);
  }
}

export async function StopApplication(execData) {
  alert("stop my application");
}

export async function PauseApplication(execData) {
  alert("pause my application");
}

export async function ContinueApplication(execData) {
  alert("continue my application");
}
