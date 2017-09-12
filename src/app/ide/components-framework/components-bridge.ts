/**
 * -- Auto generated --
 * Components - Instantiation of the Components of IDE
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * 2017-09-12 10:47:59.604229
 */

import { IDEUIComponent } from "../../../../src/app/ide/components-framework/ide-ui-component";
import { StartPageComponent } from "../../../../src/app/ide/components-framework/build-in.components/start-page/start-page";
import { ApplicationListSP } from "../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/application-list-s-p/application-list-s-p";
import { SmartObjectListSP } from "../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-elements/smart-object-list-s-p/smart-object-list-s-p";
import { StartPageMenu } from "../../../../src/app/ide/components-framework/build-in.components/start-page/start-page-menu/start-page-menu";
import { Shell } from "../../../../src/app/ide/components-framework/common.components/shell/shell";
import { MainArea } from "../../../../src/app/ide/components-framework/common.components/shell/main-area/main-area";
import { Menu } from "../../../../src/app/ide/components-framework/common.components/shell/menu/menu";
import { Toolbar } from "../../../../src/app/ide/components-framework/common.components/shell/toolbar/toolbar";
import { BlocklyVPL } from "../../../../src/app/ide/ide-components/blockly/blockly";
import { ICEVPL } from "../../../../src/app/ide/ide-components/ice/ice";


export class ComponentsBridge {
	public static Initialize(): void {
		IDEUIComponent.OnInit();
		StartPageComponent.OnInit();
		ApplicationListSP.OnInit();
		SmartObjectListSP.OnInit();
		StartPageMenu.OnInit();
		Shell.OnInit();
		MainArea.OnInit();
		Menu.OnInit();
		Toolbar.OnInit();
		BlocklyVPL.OnInit();
		ICEVPL.OnInit();
	}

}
