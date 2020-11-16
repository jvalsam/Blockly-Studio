/// <reference path="../../../../../../../../node.d.ts"/>
import SmartGroupTaskTmpl from "./smart-group.tmpl";
import SmartGroupTaskSYCSS from "./smart-group.sycss";

export const SmartGroup = {
    name: 'pi-smart-group',
    // refers to the editor instances will be injected on the template
    editorsConfig: [
        // refactoring may cause crashes on daomin data, TODO: check
        {
            selector: 'ec-smart-group', // area editor will be hosted
            config: 'ec-smart-group'    // config name
        }
                          // in case this mission exist more than once
                          // use '__' and the order number in the end
                          // same use in the template as selector!
                          // e.g. "ec-blockly-task__2"
    ],
    // Editor Layout handles to render and load the respective template
    // and inject the editor parts of the project item
    view: {
        template: SmartGroupTaskTmpl, // load template, by default focus out style
        style: SmartGroupTaskSYCSS, // style has to be added dynamically in the first use of template?
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