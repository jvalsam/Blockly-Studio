/**
 * ComponentView - IDEUIComponent has instance of ComponentView which is responsible for the look and feel of the component
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * September 2017
 */

import { View, IViewEventRegistration } from "../view/view";

export class ComponentView extends View {
    private renderData: Object;
    private eventRegData: Array<IViewEventRegistration>;

    constructor(name: string, selector: string, templateHTML: string) {
        super(name, selector, templateHTML);
        this.renderData = {};
        this.eventRegData = new Array<IViewEventRegistration>();
    }

    public setRenderData(templateData: Object): void {
        this.renderData = templateData;
    }

    public setEventRegData(eventRegs: Array<IViewEventRegistration>) {
        this.eventRegData = eventRegs;
    }

    public render(): void {
        this.$el.html(this.template(this.renderData));
    }

    public registerEvents(): void {
        this.attachEvents(...this.eventRegData);
    }
}
