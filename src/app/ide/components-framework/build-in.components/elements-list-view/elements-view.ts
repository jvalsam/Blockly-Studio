import { ComponentViewElement } from "../../component/component-view";

export abstract class ElementsList<T, Y> extends ComponentViewElement {
    protected _filters: Array<Y>;
    protected _elements: Array<T>;

    protected abstract requestElementsData(): void;

    public initialize(): void {
        this.requestElementsData();
        super.initialize();
    }

    public update(): void {
        this.render();
        $(this.selector).empty();
        $(this.selector).append(this.$el);
    }

    public onOpen(): void {
        ;
    }

    public onClose(): void {
        ;
    }

    public onAddElement(element: T): void {
        //TODO: request to add element in DB
        this._elements.push(element);
        this.update();
    }

    public onDeleteElement(element: T): void {
        //TODO: request to add element in DB
        this._elements.splice(this._elements.indexOf(element, 0), 1);
        this.update();
    }

    public destroy(): void {
        //TODO: request to update elements in DB
    }
}
