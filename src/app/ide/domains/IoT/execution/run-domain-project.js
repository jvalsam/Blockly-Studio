// Script that the domain project runs in the platform
// It is required to provide async functions StartApp
// and StopApp.
// inject 

// import 'ide-runtime-execution'; -> controls if the user choose to stop the application...
// import "iotivity", "visma"

var Events;
var SmartObjects;
var Tasks;

function initGlBs() {
    Events = {};
    SmartObjects = {};
    Tasks = {};
}

export async function StartApp(appInst) {
    initGlBs();

    // initialize smart objects source code
    appInst.SmartObjects.forEach(smartobject => {
        eval(smartobject.code);
    });

    // initialize defined tasks
    appInst.Tasks.forEach(task => {
        eval(task);
    });

    // initialize defined events
    appInst.Events.Conditions.forEach(condEvt => {

    });
    appInst.Events.Calendar.forEach(calendarEvt => {

    });
    appInst.Events.Time.forEach(timeEvt => {

    });

    // application starts with 'Start' task
    Tasks["Start"]();
}

export async function StopApp(appInst) {
    // check all the ids of events to stop all of them
    // init all the objects

}
