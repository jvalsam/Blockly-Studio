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
