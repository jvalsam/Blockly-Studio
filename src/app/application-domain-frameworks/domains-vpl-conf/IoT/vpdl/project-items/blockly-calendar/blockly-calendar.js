/// <reference path="../../../../../../../../node.d.ts"/>
import BlocklyCalendarTmpl from "./blockly-calendar.tmpl";
import BlocklyCalendarSYCSS from "./blockly-calendar.sycss";

export const BlocklyCalendar = {
  name: "pi-blockly-calendar-event",
  // refers to the editor instances will be injected on the template
  editorsConfig: [
    // refactoring may cause crashes on daomin data, TODO: check
    {
      selector: "ec-blockly-calendar-event", // area editor will be hosted
      config: "ec-blockly-calendar-event", // config name
    },
    // in case this mission exist more than once
    // use '__' and the order number in the end
    // same use in the template as selector!
    // e.g. "ec-blockly-task__2"
  ],
  // Editor Layout handles to render and load the respective template
  // and inject the editor parts of the project item
  actionsHandling: {
    // call after fill-in data
    createPrevious: (pelem, onsuccess) => {
        onsuccess.exec_open_dialogue();
    },
    createAfter: (pelem, onsuccess) => {
        onsuccess.exec_action();
    },
    // call before fill-in the data
    deletePrevious: (pelem, onsuccess) => {
        onsuccess.exec_open_dialogue();
    },
    deleteAfter: (pelem, onsuccess) => {
        onsuccess.exec_action();
    },
    // call after fill-in data
    renamePrevious: (pelem, onsuccess) => {
        onsuccess.exec_open_dialogue();
    },
    renameAfter: (pelem, onsuccess) => {
        onsuccess.exec_action();
    }
  },
  view: {
    template: BlocklyCalendarTmpl, // load template, by default focus out style
    style: BlocklyCalendarSYCSS, // style has to be added dynamically in the first use of template?
    focus: () => {}, // focus style
    focusOut: () => {}, // focus out style
    events: [
      // data of one event:
      // {
      //     eventType: "click",
      //     selector: ".template-area",
      //     handler: (e) => {} // action will be handled on Editor Manager
      // }
    ],
  },
};
