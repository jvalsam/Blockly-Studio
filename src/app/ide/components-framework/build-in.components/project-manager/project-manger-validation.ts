import * as _ from "lodash";
import { ProjectManagerAppInstanceView } from './project-manager-view/project-manager-elements-view/project-manager-application-instance-view/project-manager-app-instance-view';
import { ProjectManagerElementView } from "./project-manager-view/project-manager-elements-view/project-manager-application-instance-view/project-manager-element-view";


export class ProjectManagerValidation {
    // Returns true if it is valid or validation errors [ {} ]
    public static check(
        item: ProjectManagerElementView,
        projectInst: ProjectManagerAppInstanceView,
        vchecks: Array<{type:string, data: any}>
    ): any {
        let errors = [];

        _.forEach(vchecks, (vcheck) => {
            let response;

            switch(vcheck.type) {
                case "system":
                    response = this[vcheck.data.name] (item, projectInst, vcheck.data.args);
                    break;
                case "custom":
                    response = vcheck.data.validation_func (item, projectInst, vcheck.data.args);
                    break;
            }

            if (typeof(response) !== "boolean") {
                errors.push(response);
            }
        });

        return (errors.length === 0) ? true : errors;
    }

    // validation check provided by the platform

    private static duplicate(item, projectInst: ProjectManagerAppInstanceView) {

    }

    private static valid_name (item, projectInst: ProjectManagerAppInstanceView, rules) {

    }
}