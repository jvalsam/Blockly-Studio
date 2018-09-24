import { View, IViewUserStyleData } from "../../../../../component/view";
import { IDEUIComponent } from "../../../../../component/ide-ui-component";
import { assert } from "../../../../../../shared/ide-error/ide-error";
import { ActionsView } from "../../../../../common-views/actions-view/actions-view";
import { ViewRegistry } from "../../../../../component/registry";
import { PageFoldingView } from "../../../../../common-views/page-folding-view/page-folding-view";


export abstract class ProjectManagerElementView extends View {
    protected actions: ActionsView;
    protected foldingView: PageFoldingView;

    constructor(
        parent: IDEUIComponent,
        name: string,
        templateHTML: string,
        style: Array<IViewUserStyleData>,
        hookSelector: string,
        protected meta: any,
        protected path: string
    ) {
        super(parent, name, templateHTML, style, hookSelector);
    }

    protected initActions(selector: string, styles) {
        if (this.meta.actions.length > 0) {
            this.actions = <ActionsView>ViewRegistry.getEntry("ActionsView").create(
                this.parent,
                selector,
                styles,
                { "actions": this.meta.actions, "concerned": this }
            );
        }
        else {
            this.actions = null;
        }
    }

    protected initFolding(selector: string, pfSelector: string, foldIcon: any, styles?:any) {
        this.foldingView = <PageFoldingView>ViewRegistry.getEntry("PageFoldingView").create(this.parent, selector);
        this.foldingView.setPFSelector(pfSelector);
        this.foldingView.setFoldIcon(foldIcon);
        if (styles) {
            this.foldingView.userStyles (styles);
        }
    }

    private getElementHelper(items, categories, type) {
        if (items && items>0) {
            return items[items.map(x=>x.type).indexOf(type)];
        }
        if (categories && categories>0) {
            return categories[categories.map(x=>x.type).indexOf(type)];
        }
        return null;
    }
    public getElementRenderData(type: string) {
        assert (this.meta.validChildren && this.meta.validChildren[type], "Not valid children with name "+type+" in item view " + this.meta.type);
        return this.getElementHelper(this.meta.items, this.meta.categories, type);
    }
}