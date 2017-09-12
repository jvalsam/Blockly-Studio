/**
 * IDEUIComponent - standar functionality of visible ide components
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import * as _ from "lodash";
import {
    ComponentMetadata,
    ExportedFunction
} from "./ide-component";
import {
    IDEUIComponent
} from "./ide-ui-component";

@ComponentMetadata({
    name: "ui-ide-template-component",
    description: "All components which are visible (has html template) in the IDE",
    version: "1.0"
})
export abstract class IDEUITmplComponent extends IDEUIComponent {
    protected _template: Function;
    constructor(
        _name: string,
        _description: string,
        protected _selector: string,
        protected _templateHTML: string
    ) {
        super(_name, _description, _selector, _templateHTML);
        this._template = _.template(this._templateHTML);
    }

    get template(): Function {
        return this._template;
    }
}