import { ComponentViewElement } from "../../../component/component-view";


export abstract class StartPageElementListSP<T> extends ComponentViewElement {
    protected _elements: Array<T>;

    protected abstract requestElementsData (): void;

    public initialize(): void {
        this.requestElementsData();
        super.initialize();
    }

    public update(): void {
        this.requestElementsData();
        this._elements.forEach(
            function(element: T, index: number, elements: Array<T>) {
                this.templateHTML += (<any>element).templateHTML;
            }
        );
        //super.UpdateView(this._selector, this._templateHTML.html());
        // Setup the events of the elements
        this._elements.forEach(
            function(element: T, index: number, elements: Array<T>) {
                $(this._selector + "_" + "element.index").click(function(data) {
                    ;
                });
            }
        );
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
