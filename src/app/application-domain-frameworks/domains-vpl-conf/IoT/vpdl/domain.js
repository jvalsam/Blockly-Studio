import { DefineVPLDomainElements } from "../../../../ide/domain-manager/administration/vpl-domain-elements";
import {
  getPredefinedCategories,
  defineGeneralCategories,
} from "../../../../ide/domain-manager/common/general-blockly-toolbox";

import { ConditionalStaticBlocks } from "./domain-static-elements/conditional-blocks";
import { CalendarStaticBlocks } from "./domain-static-elements/calendar-blocks";
import { TimeAndDateStaticBlocks } from "./domain-static-elements/time-date-block";

import { SmartObject as SmartObjectVPLElem } from "./domain-elems/smart-object";
import { SmartObject as SmartObjectConf } from "./editor-configs/smart-object";
import { SmartObject as SmartObjectPI } from "./project-items/smart-object/smart-object";

import { SmartGroup as SmartGroupVPLElem } from "./domain-elems/smart-group";
import { SmartGroup as SmartGroupConf } from "./editor-configs/smart-group";
import { SmartGroup as SmartGroupPI } from "./project-items/smart-group/smart-group";

import { AutomationTask as AutomationTaskVPLElem } from "./domain-elems/automation-task";
import { AutomationTask as AutomationTaskConf } from "./editor-configs/automation-task";
import { AutomationTask as AutomationTaskPI } from "./project-items/blockly-task/blockly-task";

import { BlocklyConditional as BlocklyConditionalConf } from "./editor-configs/blockly-conditional";
import { BlocklyConditional as BlocklyConditionalPI } from "./project-items/blockly-conditional/blockly-conditional";

import { BlocklyCalendar as BlocklyCalendarConf } from "./editor-configs/blockly-calendar";
import { BlocklyCalendar as BlocklyCalendarPI } from "./project-items/blockly-calendar/blockly-calendar";

let predefinedCategories = getPredefinedCategories();
// domain author is able to edit them...
defineGeneralCategories(predefinedCategories);

export function InitializeVPDL() {
  DefineVPLDomainElements("IoT", () => ({
    domainElements: [
      SmartObjectVPLElem,
      SmartGroupVPLElem,
      AutomationTaskVPLElem,
    ],
    domainStaticElements: [
      ConditionalStaticBlocks,
      CalendarStaticBlocks,
      TimeAndDateStaticBlocks,
    ],
    editorConfigs: [
      SmartObjectConf,
      SmartGroupConf,
      AutomationTaskConf,
      BlocklyConditionalConf,
      BlocklyCalendarConf,
    ],
    projectItems: [
      SmartObjectPI,
      SmartGroupPI,
      AutomationTaskPI,
      BlocklyConditionalPI,
      BlocklyCalendarPI,
    ],
  }));
}
