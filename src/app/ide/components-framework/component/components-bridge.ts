/**
 * -- Auto generated --
 * Components - Instantiation of the Components of IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * 2017-09-20 15:34:49.938697
 */

import { StartPageComponent } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page";
import { ApplicationListSP } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/application-list-s-p/application-list-s-p";
import { SmartObjectListSP } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/smart-object-list-s-p/smart-object-list-s-p";
import { StartPageMenu } from "../../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-menu/start-page-menu";
import { Shell } from "../../../../../src/app/ide/components-framework/common.components/shell/shell";
import { MainArea } from "../../../../../src/app/ide/components-framework/common.components/shell/main-area/main-area";
import { Menu } from "../../../../../src/app/ide/components-framework/common.components/shell/menu/menu";
import { Toolbar } from "../../../../../src/app/ide/components-framework/common.components/shell/toolbar/toolbar";
import { IDEUIComponent } from "../../../../../src/app/ide/components-framework/component/ide-ui-component";
import { BlocklyVPL } from "../../../../../src/app/ide/ide-components/blockly/blockly";
import { ICEVPL } from "../../../../../src/app/ide/ide-components/ice/ice";


export class ComponentsBridge {
	public static initialize(): void {
		StartPageComponent.onInit();
		ApplicationListSP.onInit();
		SmartObjectListSP.onInit();
		StartPageMenu.onInit();
		Shell.onInit();
		MainArea.onInit();
		Menu.onInit();
		Toolbar.onInit();
		IDEUIComponent.onInit();
		BlocklyVPL.onInit();
		ICEVPL.onInit();
	}

}
