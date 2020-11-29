/**
 * Auto generated file to register the components
 */

import { RuntimeEnvironmentApp } from "./runtime-environment-app.js"

import {
    RuntimeEnvironmentRelease
} from "./components/runtime-environment-release/runtime-environment-release.js";
import {
    RuntimeEnvironmentDebug
} from "./components/runtime-environment-debug/runtime-environment-debug.js";


export class ComponentsRegistration {
    static initialize() {
        RuntimeEnvironmentApp.registerComponent();
    }
}
