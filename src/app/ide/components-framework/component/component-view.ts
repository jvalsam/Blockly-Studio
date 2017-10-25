/**
 * ComponentView - IDEUIComponent has instance of ComponentView which is responsible for the look and feel of the component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */


import { IDEUIComponent } from './ide-ui-component';
import { View, IViewEventRegistration } from "../view/view";


export class ComponentView extends View {
    private renderData: Object;
    private eventRegData: Array<IViewEventRegistration>;

    constructor(
        parent: IDEUIComponent,
        name: string,
        private _selector: string,
        templateHTML: string,
        renderData: Object = {},
        eventRegdata: Array<IViewEventRegistration> = new Array<IViewEventRegistration>()
    ) {
        super(parent, name, templateHTML);
        this.renderData = renderData;
        this.eventRegData = eventRegdata;
    }

    get selector (): string { return this._selector; }
    set selector (newSel: string) { this._selector = newSel; }

    public setRenderData(templateData: Object): void {
        this.renderData = templateData;
    }

    public setEventRegData(...eventRegs: Array<IViewEventRegistration>) {
        this.eventRegData = eventRegs;
    }

    public render(): void {
        this.$el.html(this.template(this.renderData));
        this.registerEvents();
    }

    public registerEvents(): void {
        this.attachEvents(...this.eventRegData);
    }
}
