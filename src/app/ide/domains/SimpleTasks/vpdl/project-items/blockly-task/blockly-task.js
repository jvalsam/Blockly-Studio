/// <reference path="../../../../../../../../node.d.ts"/>
import BlocklyTaskTmpl from "./blockly-task.tmpl";
import BlocklyTaskSYCSS from "./blockly-task.sycss";

export const BlocklyTask = {
    name: 'pi-blockly-task',
    // refers to the editor instances will be injected on the template
    editorsConfig: [
        'ec-blockly-task' // in case this mission exist more than once
                          // use '__' and the order number in the end
                          // same use in the template as selector!
                          // e.g. "ec-blockly-task__2"
    ],
    // Editor Layout handles to render and load the respective template
    // and inject the editor parts of the project item
    view: {
        template: BlocklyTaskTmpl, // load template
        style: BlocklyTaskSYCSS, // style has to be added dynamically in the first use of template?
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