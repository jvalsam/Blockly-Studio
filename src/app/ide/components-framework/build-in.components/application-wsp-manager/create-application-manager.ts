import { ModalView } from "../../component/view";
import { ViewRegistry } from "../../component/registry";


export function CreateApplicationManager (
    domainType: string,
    isUnique: Function,
    callback: Function): void {
    let modalActionView = <ModalView>ViewRegistry
        .getEntry("SequentialDialoguesModalView")
        .create(
            null,
            [{
                type: "simple",
                data: {
                    title: "Create New Application",
                    body: {
                        formElems: [
                            {
                                descriptionID: "application_title",
                                name: "Name:",
                                type: "text",
                                value: undefined,
                                description: "Select title of the project.",
                                required: true,
                                renderNO: 1,
                                placeholder: "Enter Application Name",
                                defaultValue: ""
                            },
                            {
                                descriptionID: "application_description",
                                name: "Description:",
                                type: "text",
                                value: undefined,
                                description: "Select description of the project.",
                                required: true,
                                renderNO: 2,
                                placeholder: "Enter Application Description",
                                defaultValue: ""
                            }
                        ]
                    },
                    actions: [
                        {
                            choice: "Cancel",
                            type: "button",
                            providedBy: "self"
                        },
                        {
                            choice: "Create",
                            type: "submit",
                            providedBy: "creator",
                            validation: (data, callback) =>
                                isUnique(
                                    data,
                                    callback
                                ),
                            callback: (data) => callback(data)
                        }
                    ]
                }
            }]
        );
    modalActionView.open();
}

export function NewApplication(
    name: string,
    description: string,
    author: any,
    domainType: string
): any {
    return {
        "author": author,
        "systemIDs": 1,
        "projectItems": [],
        "domainElements": [],
        "title": name,
        "description": description,
        "domainType": domainType,
        "componentsData": {}
    };
}
