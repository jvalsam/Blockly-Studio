/**
 * Editor - Super class of editors, common functionality has to be supported by editors
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * November 2017
 */

import { IDEUIComponent } from "../../component/ide-ui-component";
import { ExportedFunction } from "../../component/component-loader";


export abstract class Editor extends IDEUIComponent {

    public abstract undo();
    public abstract redo();

    public abstract copy();
    public abstract paste();
}
