/**
 * -- Auto generated --
 * Components - Instantiation of the Components of IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * 2017-10-25 13:32:09.227359
 */

import { ApplicationWSPEditor } from "../../../../../src/app/ide/components-framework/build-in.components/application-wsp-editor/application-wsp-editor";
import { ApplicationWSPManager } from "../../../../../src/app/ide/components-framework/build-in.components/application-wsp-manager/application-wsp-manager";
import { StartPageComponent } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page";
import { ApplicationListSP } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/application-list-s-p/application-list-s-p";
import { ApplicationViewBox } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/application-list-s-p/application-view-box/application-view-box";
import { SmartObjectListSP } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/smart-object-list-s-p/smart-object-list-s-p";
import { SmartObjectViewBox } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/smart-object-list-s-p/smart-object-view-box/smart-object-view-box";
import { StartPageMenu } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-menu/start-page-menu";
import { Shell } from "../../../../../src/app/ide/components-framework/common.components/shell/shell";
import { MainArea } from "../../../../../src/app/ide/components-framework/common.components/shell/main-area/main-area";
import { Menu } from "../../../../../src/app/ide/components-framework/common.components/shell/menu/menu";
import { Toolbar } from "../../../../../src/app/ide/components-framework/common.components/shell/toolbar/toolbar";
import { IDEUIComponent } from "../../../../../src/app/ide/components-framework/component/ide-ui-component";
import { BlocklyVPL } from "../../../../../src/app/ide/ide-components/blockly/blockly";
import { ICEVPL } from "../../../../../src/app/ide/ide-components/ice/ice";
import { IoTWSPEditor } from "../../../../../src/app/ide/ide-components/iot/wsp-editor/iot-wsp-editor";
import { IoTAutomationList } from "../../../../../src/app/ide/ide-components/iot/wsp-editor/iot-automations/iot-automation-list";
import { IoTAutomationViewBox } from "../../../../../src/app/ide/ide-components/iot/wsp-editor/iot-automations/iot-automation-view-box/iot-automation-view-box";


export class ComponentsBridge {
	public static initialize(): void {
		ApplicationWSPEditor.onInit();
		ApplicationWSPManager.onInit();
		StartPageComponent.onInit();
		ApplicationListSP.onInit();
		ApplicationViewBox.onInit();
		SmartObjectListSP.onInit();
		SmartObjectViewBox.onInit();
		StartPageMenu.onInit();
		Shell.onInit();
		MainArea.onInit();
		Menu.onInit();
		Toolbar.onInit();
		IDEUIComponent.onInit();
		BlocklyVPL.onInit();
		ICEVPL.onInit();
		IoTWSPEditor.onInit();
		IoTAutomationList.onInit();
		IoTAutomationViewBox.onInit();
	}

}
