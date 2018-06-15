import { ViewRegistry } from './../../../component/registry';
import { ISelectData } from './../../configuration/configuration-view/property-views/select-view/select-view';
/// <reference path="../../../../../../../node.d.ts"/>
import DomainTmpl from "./domain-view.html";
import { View, ViewMetadata } from "../../../component/view";
import { ApplicationListSP } from "../../applications-view/application-list-s-p/application-list-s-p";
import { DomainsAdministration } from "./../../applications-admin-sc/domains-admin";
import { SelectView } from "../../configuration/configuration-view/property-views/select-view/select-view";
import { IDEUIComponent } from '../../../component/ide-ui-component';
import { ComponentViewElement, ComponentViewElementMetadata } from '../../../component/component-view';

@ComponentViewElementMetadata({
    name: "DomainView",
    //selector: ".domain-view-area",
    templateHTML: DomainTmpl
})
export class DomainView extends ComponentViewElement {
    private selectedValue: string;
    private selectionView: SelectView;
    private domainsAppsView: ApplicationListSP;

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        _selector: string,
        protected readonly _templateHTML: string,
        protected _hookSelector: string
    ) {
        super(parent, name, _selector, _templateHTML, _hookSelector);
        this.selectedValue = null;
        this.selectionView = null;
        this.domainsAppsView = null;
    }

    private renderImg(imgData): void {
        let img = "";
        if (imgData.fa) {
            img = "<i class=\"fa "+ imgData.fa +" fa-2x\" aria-hidden=\"true\"></i>";
        }
        else {
            img = "<img src'TODO' />";
        }
        this.$el.find(".domain-image").empty();
        this.$el.find(".domain-image").append(img);
    }

    private renderDescription(description): void {
        this.$el.find(".domain-description").empty();
        this.$el.find(".domain-description").append(description);
    }

    private renderApps(selectedDomain, callback): void {
        if (selectedDomain.type === "programming") {
            if (this.domainsAppsView === null) {
                this.domainsAppsView = <ApplicationListSP>ViewRegistry.getEntry("ApplicationsListStartPage").create(
                    this.parent,
                    { domain: selectedDomain }
                );
                this.domainsAppsView.render(callback);
            }
            else {
                this.domainsAppsView.setDomain(selectedDomain.name, callback);
            }
        }
        else {
            this.domainsAppsView.destroy();
            delete this.domainsAppsView;
            this.domainsAppsView = null;
            callback(true);
        }
    }

    public renderOnResponse (domains, callback): void {
        let values = domains.map(x=>x.title);
        this.selectedValue = this.selectedValue ? this.selectedValue : values[0];
        let domainsData: ISelectData = {
            name: "Domain",
            style: "",
            selected: this.selectedValue,
            values: values,
            type: "aggregate",
            renderName: true,
            indepedent: true
        };
        this.selectionView = <SelectView>ViewRegistry.getEntry("SelectView").create(this.parent, ".domain-selection", domainsData);
        this.selectionView.render();
        // this.$el.find(".domain-selection").empty();
        // this.$el.find(".domain-selection").append(this.selectionView.$el);
        this.registerEvents();

        var selectedDomain = domains[values.indexOf(this.selectedValue)];

        this.renderImg(selectedDomain.img);
        this.renderDescription(selectedDomain.description);

        this.renderApps(
            selectedDomain,
            (appsEmpty?: Boolean) => {
                this.$el.find(".domain-applications").empty();
                if (!appsEmpty) {
                    this.$el.find(".domain-applications").append(this.domainsAppsView.$el);
                }
                callback();
            }
        );
    }

    public render(callback?: Function): void {
        this.renderTmplEl();
        DomainsAdministration.requestDomains(
            (domains) => this.renderOnResponse(domains, callback)
        );
    }

    public registerEvents(): void {}
}