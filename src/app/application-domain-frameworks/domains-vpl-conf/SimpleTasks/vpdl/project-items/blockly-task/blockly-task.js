/// <reference path="../../../../../../../../node.d.ts"/>
import BlocklyTaskTmpl from "./blockly-task.tmpl";
import BlocklyTaskSYCSS from "./blockly-task.sycss";

export const BlocklyTask = {
    name: 'pi-blockly-task',
    // refers to the editor instances will be injected on the template
    editorsConfig: [
        // refactoring may cause crashes on daomin data, TODO: check
        {
            selector: 'ec-blockly-task', // area editor will be hosted
            config: 'ec-blockly-task'    // config name
        }
                          // in case this mission exist more than once
                          // use '__' and the order number in the end
                          // same use in the template as selector!
                          // e.g. "ec-blockly-task__2"
    ],
    // Editor Layout handles to render and load the respective template
    // and inject the editor parts of the project item
    handledDomainElems: [
    ],
    actionsHandling: {
        // call after fill-in data
        createPrevious: (pelem, onsuccess) => {
            onsuccess();
        },
        createAfter: (pelem, onsuccess) => {
            onsuccess();
        },
        // call before fill-in the data
        deletePrevious: (pelem, onsuccess) => {
            onsuccess();
        },
        deleteAfter: (pelem, onsuccess) => {
            onsuccess();
        },
        // call after fill-in data
        renamePrevious: (pelem, onsuccess) => {
            onsuccess();
        },
        renameAfter: (pelem, onsuccess) => {
            onsuccess();
        }
    },
    view: {
        template: BlocklyTaskTmpl, // load template, by default focus out style
        style: BlocklyTaskSYCSS, // style has to be added dynamically in the first use of template?
        focus: () => {}, // focus style
        focusOut: () => {}, // focus out style
        events: [
            // data of one event:
            // {
            //     eventType: "click",
            //     selector: ".template-area",
            //     handler: (e) => {} // action will be handled on Editor Manager
            // }
        ]
    }
};