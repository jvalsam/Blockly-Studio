import { DomainElementsHolder } from './../../domain-manager/domains-holder';
import { Editor, IDomainElementData } from "../../components-framework/build-in.components/editor-manager/editor";
import {
    ExportedSignal,
    ExportedFunction,
    RequiredFunction,
    ListensSignal,
    PlatformEditorMetadata,
    ExportedStaticFunction
} from "../../components-framework/component/component-loader";
import smart_object_communication from "./smart_object_communication.js";
import iotivity_communication from "../../../../../domains-libs/IoT/iotivity_communication";
import create_smart_object_registration_form from "./smart_object_registration_form.js";
import "./../../shared/upload-files";
import { upload_files } from "./../../shared/upload-files";
import { ProjectItem } from '../../components-framework/build-in.components/project-manager/project-manager-jstree-view/project-manager-elements-view/project-manager-application-instance-view/project-item';

var menuJson: any = require("./conf_menu.json");
var confJson: any = require("./conf_props.json");

@PlatformEditorMetadata({
    description: "VPL handling Smart Objects",
    authors: [
      {
        name: "Marios Ntoulas",
        email: "ntoulasm@ics.forth.gr",
        date: "October 2018"
      }
    ],
    missions: [
        "CreateSmartObject",
        "CreateSmartEnvironment",
        "ViewAllSmartObjects",
        "ViewSmartEnvironment",
        "EditEnvironment",
        "ViewSmartObject",
        "EditSmartObject"
    ],
    componentView: "ViSmaOEView",
    menuDef: menuJson,
    configDef: confJson,
    version: "1.0"
})
export class ViSmaOE extends Editor {
    @ExportedFunction
    public onOpen(): void {
        alert("on open");
    }
    public closeSRC(srcId: string): void {
        //
    }

    @ExportedSignal('create-smart-object')
    @ExportedSignal('delete-smart-object')
    @ExportedSignal('rename-smart-object')
    @ExportedSignal('create-smart-environment')
    @ExportedSignal('delete-smart-environment')
    @ExportedSignal('rename-smart-environment')

    @RequiredFunction("Shell", "addTools")
    @ExportedFunction
    public open(src: string, toolbox?: string, isFirstInst:boolean =false): void {
        this._view.setRenderData({});
    }

    @ExportedFunction
    public onClose(): void {
    }

    public undo(): void {

    }
    public redo(): void {

    }

    public copy(): void {

    }

    public paste(): void {

    }

    public registerEvents(): void {

    }

    public update(): void {

    }

    public update_src(data: any, pitem: any, focus: boolean): void {

    }

    public destroy(): void {

    }

    public tools(editorId: string) {
        return [];
    }

    // @ExportedSignal('create-smart-object')
    @ExportedStaticFunction
    public static CreateSmartObject(): any {
        return { 
            "SmartObjectElems": "TODO create",
            "is_empty": true  
        };
    }

    public updatePItemData(id, pitem) {}

    // @ExportedSignal('delete-smart-object')
    // @ExportedStaticFunction
    // public static DeleteSmartObject(): void {

    // }

    // @ExportedSignal('rename-smart-object')
    // @ExportedStaticFunction
    // public static RenameSmartObject(): void {

    // }

    // @ExportedSignal('create-smart-environment')
    @ExportedStaticFunction
    public static CreateSmartEnvironment(): any {
        return { "SmartEnvironmentElems": "TODO create" };
    }

    // @ExportedSignal('delete-smart-environment')
    // @ExportedStaticFunction
    // public static DeleteSmartEnvironment(): void {
    // }

    // @ExportedSignal('rename-smart-environment')
    // @ExportedStaticFunction
    // public static RenameSmartEnvironment(): void {
    // }

    @ExportedFunction
    public ViewAllSmartObjects() {
        alert("ViSmaOE: View All SmartObjects is called but not implemented yet!");
    }

    @ExportedFunction
    public ViewSmartEnvironment() {
        alert("ViSmaOE: View Smart Environment is called but not implemented yet!");
    }
    
    @ExportedFunction
    public EditEnvironment() {
        alert("ViSmaOE: Edit Environment is called but not implemented yet!");
    }

    @ExportedFunction
    public ViewSmartObject(source: any) {

        this.render();

        const suim = window["suim"];
        const ViSmaOEDom = document.getElementById(this._view.id);

        function smart_object_properties_to_array(smart_object_properties) {
            let smart_object_properties_array = [];
            let i = 0;
            for(let property in smart_object_properties) {
                if(!smart_object_properties.hasOwnProperty(property)) {
                    continue;
                }
                let property_value = smart_object_properties[property];
                smart_object_properties_array[i++] = property + ": " + property_value;
            }
            return smart_object_properties_array;
        }

        function compute_unregistered_smart_objects(online_smart_objects, registered_smart_objects) {
            let unregistered_smart_objects = [];
            for(const online_smart_object of online_smart_objects) {
                let registered = false;
                for(const registered_smart_object of registered_smart_objects) {
                    if(registered_smart_object.uri == online_smart_object.resourcePath) {
                        registered = true;
                        break;
                    }
                }
                if(!registered) {
                    unregistered_smart_objects.push(online_smart_object);
                }
            }
            return unregistered_smart_objects;
        }

        let scan_button = suim.create_component({
            component: "button",
            name: "scan_smart_objects",
            message: "Scan smart objects",
            on_click: scan_smart_objects,
            type: "info",
            parent: this._view.id
        });

        let scanned_smart_objects = suim.create_ui_object({
            widget: "div",
            name: "scanned_smart_objects",
            layout_container: "accordion",
            parent: this._view.id
        });

        let register_modal = suim.create_component({
            component: "modal",
            name: "register_smart_object_modal",
            type: "info",
            parent: this._view.id
        });

        scan_button.fire_event("click");

        function scan_smart_objects() {

            scan_button.disable();
            scan_button.set_message("Scanning...");

            let progress_bar = suim.create_component({
                component: "progress_bar",
                name: "scan_smart_objects_progress",
                message: "Scanning for smart objects...",
                type: "info",
                striped: true
            });

            ViSmaOEDom["suim_object"].hook_after(progress_bar, scan_button);

            let scan_progress = 0;
            let progress_bar_interval_id = setInterval(update_progress, 80);

            function update_progress() {
                if(++scan_progress <= 100) {
                    progress_bar.set_progress(scan_progress);
                }
            }

            iotivity_communication.get_online_smart_objects(
                function(smart_objects) {
                    smart_object_communication.get_registered_smart_objects(
                        function(registered_smart_objects) {
                            // clearInterval(progress_bar_interval_id);
                            progress_bar.destroy();
                            scan_button.enable();
                            scan_button.set_message("Rescan smart objects");  
                            scanned_smart_objects.destroy_children();

                            if(!smart_objects.length) {
                                suim.alert("Online smart objects not found", "info");
                            }

                            let unregistered_smart_objects = compute_unregistered_smart_objects(
                                smart_objects, registered_smart_objects
                            );
                            if(!unregistered_smart_objects.length) {
                                suim.alert("All online smart objects are registered", "info");
                            }

                            for(const smart_object of unregistered_smart_objects) {
                                let smart_object_uri = smart_object.resourcePath;
                                let register_form = create_smart_object_registration_form(Object.keys(smart_object.properties));
                                let properties_panel = scanned_smart_objects.create({
                                    component: "container",
                                    name: "smart_object",
                                    attributes: {
                                        class: "smart_object"
                                    },
                                    contents: [
                                        {
                                            component: "panel",
                                            name: "smart_object_properties_panel",
                                            title: "Properties",
                                            type: "info",
                                            content: {
                                                component: "list",
                                                name: "smart_object_property_list",
                                                items: smart_object_properties_to_array(smart_object.properties),
                                            }
                                        },
                                        {
                                            component: "button",
                                            name: "register_smart_object",
                                            message: "Register Smart Object",
                                            type: "success",
                                            on_click: function() {
                                                register_modal.set_title("Register " + smart_object_uri);
                                                register_modal.set_content(register_form);
                                                register_form.input_container.name.set_value(source.title);
                                                register_form.set_on_submit(function(data) {
                                                    register_form.set_submit("Trying to register...");

                                                    upload_files(
                                                        data, 
                                                        function([image_url]) {
                                                            let json_data = register_form.get_json();
                                                            delete json_data["files"];
                                                            json_data.image = image_url;
                                                            json_data.uri = smart_object_uri;
                                                            smart_object_communication.register_smart_object(
                                                                json_data,
                                                                function() {
                                                                    register_form.set_submit("Register Smart Object");
                                                                    suim.alert("Smart Object registered successfully", "success");
                                                                    register_modal.close();
                                                                },
                                                                function(response) {
                                                                    console.log(response);
                                                                    register_form.set_submit("Register Smart Object");
                                                                    suim.alert(response, "danger");
                                                                    register_modal.close();
                                                                } 
                                                            );
                                                        },
                                                        function() {
                                                            
                                                        }
                                                    );

                                                });
                                                register_modal.open();
                                            }
                                        }
                                    ],
                                    properties: {
                                        title: smart_object_uri
                                    }
                                });
                            }

                        }, 
                        function(res) {
                            alert(res);
                        }
                    );

                }, function(data) {
                    suim.alert("Could not connect with '" + "iotivity_url" + "'", "danger");    // TODO: change message
                    scan_button.enable();
                    scan_button.set_message("Rescan Smart Objects");
                    progress_bar.destroy();
                }
            );

        }
    }

    @ExportedFunction
    public EditSmartObject() {
        alert("ViSmaOE: Edit Smart Object is called but not implemented yet!");
    }

    @ExportedFunction
    public onChangeConfig(values: any): void {
        alert("ViSmaOE: on change config data not developed yet in ViSmaOE Component");
    }

    public getDomainElementData(projectId: string, domainElemId: string): IDomainElementData {
        let elem = DomainElementsHolder["getElement"](projectId, domainElemId);
        elem.data.id = elem.id;

        let signal =
            "create-smart-"
            + (elem.name === "SmartObject" ? "object" : "environment");

        return {
            signal: signal,
            data: elem.data
        };
    }

    public factoryNewItem(pitemName: string, econfigName: string, pitemInfo: any, editorConfig: any): any {
        return { src: "<xml id=\"startBlocks\" style=\"display: none\"></xml>" };
    }

    public generateCodeDataForExecution (data: any) {
        
    }

    @ExportedFunction
    public loadSource(editorData: any, pitem: ProjectItem) {
        // load data by creating instance of the visual domain element
    }
}