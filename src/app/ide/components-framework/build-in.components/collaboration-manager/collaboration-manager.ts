import { SessionHolder } from './session-holder';
import {
    ExportedFunction,
    UIComponentMetadata,
    RequiredFunction
} from "../../component/component-loader";
import { IDEUIComponent } from "../../component/ide-ui-component";
import {
    ComponentsCommunication
} from "./../../component/components-communication";
import { openStartSessionDialogue } from "./collaboration-component/collaboration-gui/dialogs";
import { collaborationFilter } from "./collaboration-component/collaboration-core/utilities";
import { communicationInitialize } from "./collaboration-component/collaboration-core/index";

var menuJson;
var configJson;

interface IOption {
    label: string;
    icon: string;
    action: Function;
};
interface ITool {
    icon: string;
    tooltip: string;
    action: Function;
};


@UIComponentMetadata({
    description: "Collaboration Manager of the IDE",
    authors: [
        {
            date: "",
            name: "",
            email: ""
        }
    ],
    componentView: "CollaborationManagerView",
    menuDef: menuJson,
    configDef: configJson,
    version: "1.0"
})
export class CollaborationManager extends IDEUIComponent {
    public registerEvents(): void {
        throw new Error("Method not implemented.");
    }
    public update(): void {
        throw new Error("Method not implemented.");
    }
    public onOpen(): void {
        throw new Error("Method not implemented.");
    }
    public onClose(): void {
        throw new Error("Method not implemented.");
    }
    public destroy(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * 1. Pop up modal dialogue to start the collaboration process
     * 2. Collaboration toolbar opens...
     * @param dialogSel JQUERY div
     * @param dialogSel JQUERY div
     * @param dialogSel JQUERY div
     * @param dialogSel JQUERY div
     * 
     */
    @ExportedFunction
    public startSession(
        $dialog: any,
        projectObj: any,
        $container: any,
        callback: (sharedProjectObj:any) => void
    ) {
        openStartSessionDialogue(
            $dialog,
            $container,
            (memberInfo, settings) => {
                let sharedProject = collaborationFilter(
                    projectObj,
                    memberInfo,
                    settings
                );
                communicationInitialize();
                //
                callback(sharedProject);
            },
            () => { callback(null); }
        );
    }

    @ExportedFunction
    public joinSession(selDialog: any, callback: Function) {
        SessionHolder.User = {
            id: "george_id",
            username: "george"
        };

        let project = {
            "_id": "5e8278e38d8bb7792f314fa0",
            "author": {
                "id": "5ac8e06dac135912cc2314ac",
                "username": "wtina"
            },
            "systemIDs": 27,
            "projectItems": [
                {
                    "privileges": {
                        "shared": {
                            "members": [],
                            "type": "SHARED_PROJECT"
                        },
                        "author": "wtina",
                        "owner": "wtina"
                    },
                    "editorsData": [
                        {
                            "_id": "5e9f87ab5c747e2d008b5215",
                            "id": "pi_5e8278e38d8bb7792f314fa0_17_ec-blockly-task",
                            "data": {
                                "name": "BlocklyVPL",
                                "text": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"$jgDEu^xaaCd;yUcIH{b\" x=\"620\" y=\"266\"><value name=\"TIMES\"><shadow type=\"math_number\" id=\"7I)~.:3gN8[5P/#p}R+{\"><field name=\"NUM\">10</field></shadow><block type=\"math_arithmetic\" id=\"+ZQ1S2B0$fv4d*@[K-_R\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\" id=\"vK9)4r|^7AltQ%n2M,nj\"><field name=\"NUM\">1</field></shadow></value><value name=\"B\"><shadow type=\"math_number\" id=\"%}t{;Fx#|1jR.WEjPrCI\"><field name=\"NUM\">1</field></shadow></value></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"Fq-`07gKnzIm!KKa(N*X\"/></statement></block></xml>"
                            }
                        }
                    ],
                    "renderParts": [
                        {
                            "_id": "5e8e414b1ac1a02720c7682a",
                            "type": "img",
                            "value": {
                                "fa": "fa fa-tablet"
                            }
                        },
                        {
                            "_id": "5e8e414b1ac1a02720c76829",
                            "type": "title",
                            "value": {
                                "text": "Blockly Task 16"
                            }
                        },
                        {
                            "_id": "5e8e414b1ac1a02720c76828",
                            "type": "colour",
                            "value": {
                                "colour": "#DAD9D9"
                            }
                        }
                    ],
                    "systemID": "5e8278e38d8bb7792f314fa0_17",
                    "parent": "jstree_BlocklyTasks",
                    "orderNO": 1,
                    "type": "pi-blockly-task"
                },
                {
                    "privileges": {
                        "shared": {
                            "members": [],
                            "type": "SHARED_PROJECT"
                        },
                        "author": "george",
                        "owner": "george"
                    },
                    "editorsData": [
                        {
                            "_id": "5e9f8a515c747e2d008b52ee",
                            "id": "pi_5e8278e38d8bb7792f314fa0_23_ec-blockly-task",
                            "data": {
                                "name": "BlocklyVPL",
                                "text": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"~vs~ABfeTPj}M7`{A2hX\" x=\"468\" y=\"194\"><value name=\"TIMES\"><shadow type=\"math_number\" id=\"`0Z7RN)L#yTsh^~oB*Rs\"><field name=\"NUM\">10</field></shadow></value></block></xml>"
                            }
                        }
                    ],
                    "renderParts": [
                        {
                            "_id": "5e8e51dec502251ee8b55967",
                            "type": "img",
                            "value": {
                                "path": "http://localhost/uploaded_files\\files-1586385374039-452287735"
                            }
                        },
                        {
                            "_id": "5e8e51dec502251ee8b55966",
                            "type": "title",
                            "value": {
                                "text": "Blockly Task 22"
                            }
                        },
                        {
                            "_id": "5e8e51dec502251ee8b55965",
                            "type": "colour",
                            "value": {
                                "colour": "#ffff80"
                            }
                        }
                    ],
                    "systemID": "5e8278e38d8bb7792f314fa0_23",
                    "parent": "jstree_BlocklyTasks",
                    "orderNO": 2,
                    "type": "pi-blockly-task"
                },
                {
                    "privileges": {
                        "shared": {
                            "members": []
                        }
                    },
                    "renderParts": [
                        {
                            "_id": "5e9dcc62872acf166860b036",
                            "type": "img",
                            "value": {
                                "fa": "fa fa-tablet"
                            }
                        },
                        {
                            "_id": "5e9dcc62872acf166860b035",
                            "type": "title",
                            "value": {
                                "text": "My task"
                            }
                        },
                        {
                            "_id": "5e9dcc62872acf166860b034",
                            "type": "colour",
                            "value": {
                                "colour": "#34f551"
                            }
                        }
                    ],
                    "systemID": "5e8278e38d8bb7792f314fa0_24",
                    "parent": "jstree_BlocklyTasks",
                    "orderNO": 3,
                    "type": "pi-blockly-task",
                    "editorsData": []
                },
                {
                    "privileges": {
                        "shared": {
                            "members": []
                        }
                    },
                    "renderParts": [
                        {
                            "_id": "5e9e109c872acf166860b3ab",
                            "type": "img",
                            "value": {
                                "fa": "fa fa-tablet"
                            }
                        },
                        {
                            "_id": "5e9e109c872acf166860b3aa",
                            "type": "title",
                            "value": {
                                "text": "test"
                            }
                        },
                        {
                            "_id": "5e9e109c872acf166860b3a9",
                            "type": "colour",
                            "value": {
                                "colour": "#DAD9D9"
                            }
                        }
                    ],
                    "systemID": "5e8278e38d8bb7792f314fa0_25",
                    "parent": "jstree_BlocklyTasks",
                    "orderNO": 4,
                    "type": "pi-blockly-task",
                    "editorsData": []
                },
                {
                    "privileges": {
                        "shared": {
                            "members": []
                        }
                    },
                    "renderParts": [
                        {
                            "_id": "5e9e109c872acf166860b3a8",
                            "type": "img",
                            "value": {
                                "fa": "fa fa-tablet"
                            }
                        },
                        {
                            "_id": "5e9e109c872acf166860b3a7",
                            "type": "title",
                            "value": {
                                "text": "Blockly Task 25"
                            }
                        },
                        {
                            "_id": "5e9e109c872acf166860b3a6",
                            "type": "colour",
                            "value": {
                                "colour": "#DAD9D9"
                            }
                        }
                    ],
                    "systemID": "5e8278e38d8bb7792f314fa0_26",
                    "parent": "jstree_BlocklyTasks",
                    "orderNO": 5,
                    "type": "pi-blockly-task",
                    "editorsData": []
                },
                {
                    "privileges": {
                        "shared": {
                            "members": []
                        }
                    },
                    "renderParts": [
                        {
                            "_id": "5e9e14fc872acf166860b435",
                            "type": "img",
                            "value": {
                                "fa": "fa fa-tablet"
                            }
                        },
                        {
                            "_id": "5e9e14fc872acf166860b434",
                            "type": "title",
                            "value": {
                                "text": "Blockly Task 26"
                            }
                        },
                        {
                            "_id": "5e9e14fc872acf166860b433",
                            "type": "colour",
                            "value": {
                                "colour": "#DAD9D9"
                            }
                        }
                    ],
                    "systemID": "5e8278e38d8bb7792f314fa0_27",
                    "parent": "jstree_BlocklyTasks",
                    "orderNO": 6,
                    "type": "pi-blockly-task",
                    "editorsData": []
                }
            ],
            "domainElements": [],
            "title": "First App",
            "description": "This is first application with only start task empy.",
            "domainType": "SimpleTasks",
            "created": "2019-01-01T00:00:00.000Z",
            "lastModified": "2019-01-01T00:00:00.000Z"
        };
        callback(project);
    }

    // @RequiredFunction("ProjectManager", "getProject")
    // public getProject(projectId): any {
    //     let project = ComponentsCommunication.functionRequest(
    //         this.name,
    //         "ProjectManager",
    //         "getProject",
    //         []
    //     ).value;
    // }

    @ExportedFunction
    public pitemOptions(pitemId: string): Array<IOption> {
        return [];
    }

    @ExportedFunction
    public pitemTools(pitemId: string): Array<ITool> {
        return [
            {
                tooltip: "Change project item floor.",
                icon: "../../../../../../images/collaboration/send.png",
                action: () => alert("test")
            }
        ];
    }

    @ExportedFunction
    public getMembers(sessionId) {
        let resp = ComponentsCommunication.functionRequest (
            this.name,
            "ProjectManager",
            "function",
            []
        );
    }
}