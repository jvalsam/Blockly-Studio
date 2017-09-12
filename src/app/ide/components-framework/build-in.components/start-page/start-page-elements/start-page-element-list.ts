/**
 * Start Page Element List - General functionality of start page elements
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

import {
    IDEUIComponent,
    IViewDataComponent
} from "../../../ide-ui-component";
import { ExportedFunction } from "../../../ide-component";


export class StartPageElement<T> {
    private _element: T;
    private _templateHTML: string;

    contructor(element: T, templateHTML: string) {
        this._element = element;
        this._templateHTML = templateHTML;
    }

    OnDelete(): void {
        ;
    }
}

export abstract class StartPageElementListSP<T> extends IDEUIComponent {
    protected _elements: Array<T>;

    //TODO: The implementation of request could be globally here
    protected abstract _requestElementsData (): void;

    @ExportedFunction
    public Initialize(): void {
        super.Initialize();
        this._requestElementsData();
    }

    @ExportedFunction
    public Update(): void {
        this._requestElementsData();
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

    @ExportedFunction
    public OnOpen(): void {
        ;
    }

    @ExportedFunction
    public OnClose(): void {
        ;
    }

    @ExportedFunction
    public GetView(): IViewDataComponent {
        return {
            main: this._templateJQ.html()
        };
    }

    @ExportedFunction
    public OnAddElement(element: T): void {
        //TODO: request to add element in DB
        this._elements.push(element);
        this.Update();
    }

    @ExportedFunction
    public OnDeleteElement(element: T): void {
        //TODO: request to add element in DB
        this._elements.splice(this._elements.indexOf(element, 0), 1);
        this.Update();
    }
    
    @ExportedFunction
    public Destroy(): void {
        //TODO: request to update elements in DB
    }
}