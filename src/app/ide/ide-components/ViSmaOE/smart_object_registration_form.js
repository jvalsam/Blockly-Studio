export default function create_smart_object_registration_form(functionalities) {
    return suim.create_component({
        component: "form",
        name: "register_form",
        data_type: "form_data",
        submit: "Register Smart Object",
        inputs: [
            {
                name: "name",
                label: "Name",
                input: {
                    component: "input"
                }
            },
            {
                name: "environment",
                label: "Environment",
                input: {
                    component: "input"
                }
            },
            {
                name: "files",
                label: "Image",
                input: {
                    component: "file_input"
                }
            },
            {
                name: "selected_functionality",
                label: "Select functionality",
                input: {
                    component: "toggle_button_group",
                    content: functionalities
                }
            }
        ]
    });
};