/**
 * Auto generated file to register the components (TODO)
 */

import {
    RuntimeEnvironmentRelease
} from "./components/runtime-environment-release/runtime-environment-release.js";
import {
    RuntimeEnvironmentDebug
} from "./components/runtime-environment-debug/runtime-environment-debug.js";
import {
    VisualDebuggerBackend
} from "./components/visual-debugger-backend/visual-debugger-backend.js";
import {
    RuntimeSmartAutomationsLivePreview
} from "./components/runtime-smart-automations-live-preview/runtime-smart-automations-live-preview.js";


class _RuntimeEnvironmentComponents {
    registration(RuntimeEnvironmentApp) {
        RuntimeEnvironmentApp.registerComponent(
            "RuntimeEnvironmentApp",
            RuntimeEnvironmentApp
        );
        RuntimeEnvironmentApp.registerComponent(
            "RuntimeEnvironmentRelease",
            new RuntimeEnvironmentRelease(RuntimeEnvironmentApp)
        );
        RuntimeEnvironmentApp.registerComponent(
            "RuntimeEnvironmentDebug",
            new RuntimeEnvironmentDebug(RuntimeEnvironmentApp)
        );
        RuntimeEnvironmentApp.registerComponent(
            "VisualDebuggerBackend",
            new VisualDebuggerBackend(RuntimeEnvironmentApp)
        );
        RuntimeEnvironmentApp.registerComponent(
            "RuntimeSmartAutomationsLivePreview",
            new RuntimeSmartAutomationsLivePreview(RuntimeEnvironmentApp)
        );
    }
}

export let RuntimeEnvironmentComponents = new _RuntimeEnvironmentComponents();