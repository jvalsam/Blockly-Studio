import * as _ from "lodash";
import { ProjectManagerAppInstanceView } from './project-manager-view/project-manager-elements-view/project-manager-application-instance-view/project-manager-app-instance-view';
import { ProjectManagerElementView } from "./project-manager-view/project-manager-elements-view/project-manager-application-instance-view/project-manager-element-view";
import { PropertyView } from "../configuration/configuration-view/property-views/property-view";


export class ProjectManagerValidation {
    // handle async response of checks
    private static _errors: Array<any>;
    private static _totalResponses: number;
    private static _totalChecks: number;
    private static _callback: Function;
    private static initCheck(vchecks: Array<{ type: string, rules: any }>, callback: Function): void {
        this._errors = [];
        this._totalResponses = 0;
        this._totalChecks = 0;
        _.forEach(vchecks, (vcheck) => this._totalChecks += vcheck.rules.length);
        this._callback = callback;
    }
    private static postResponse (response) {
        ++this._totalResponses;
        if (typeof (response) !== "boolean") {
            this._errors.push(response);
        }
        if (this._totalResponses === this._totalChecks) {
            this._callback((this._errors.length === 0) ? true : this._errors);
        }
    }

    // returns true if it is valid or validation errors [ {} ]
    public static check(
        items: {[name: string]: PropertyView },
        projectInst: ProjectManagerAppInstanceView,
        vchecks: Array<{type:string, rules: any}>,
        callback: (response) => {}
    ): void {
        this.initCheck(vchecks, callback);

        _.forEach(vchecks, (vcheck) => {
            switch(vcheck.type) {
                case "system":
                    _.forEach(vcheck.rules, (rule) => this[rule.action](rule.items, projectInst, rule.args));
                    break;
                case "custom":
                    _.forEach(vcheck.rules, (rule) => rule.validation_func (rule.items, projectInst, rule.args, this.postResponse));
                    break;
            }
        });
    }

    // validation check provided by the platform, key of items is the descriptionID of the description domain wsp

    private static duplicate (items: {[name: string]: PropertyView }, projectInst: ProjectManagerAppInstanceView) {
        alert("check for duplicate not supported yet!");
        this.postResponse(true);
    }

    private static valid_name(items: { [name: string]: PropertyView }, projectInst: ProjectManagerAppInstanceView, rules) {
        alert("check for valid name not supported yet!");
        this.postResponse(true);
    }
}