import { ViewRegistry } from './../../../component/registry';
import { ISelectData } from './../../configuration/configuration-view/property-views/select-view/select-view';
/// <reference path="../../../../../../../node.d.ts"/>
import DomainTmpl from "./domain-view.html";
import { View, ViewMetadata } from "../../../component/view";
import { ApplicationListSP } from "../../applications-view/application-list-s-p/application-list-s-p";
import { DomainsAdministration } from "./../../applications-admin-sc/domains-admin";
import { SelectView } from "../../configuration/configuration-view/property-views/select-view/select-view";
import { IDEUIComponent } from '../../../component/ide-ui-component';
import { ComponentViewElementRegistry } from '../../../component/component-view';

@ViewMetadata({
    name: "DomaiView",
    templateHTML: DomainTmpl
})
export class DomainView extends View {
    private selectedValue: string;
    private selectionView: SelectView;
    private domainsAppsView: ApplicationListSP;

    constructor(
        protected parent: IDEUIComponent,
        public readonly name: string,
        protected readonly _templateHTML: string
    ) {
        super(parent, name, _templateHTML);
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

    private renderApps(selectedDomain): void {
        if (selectedDomain.type === "programming") {
            if (this.domainsAppsView === null) {
                this.domainsAppsView = <ApplicationListSP>ComponentViewElementRegistry.getEntry("ApplicationsListStartPage").create(
                    this.parent,
                    selectedDomain.name
                );
            }
            else {
                this.domainsAppsView.setDomain(selectedDomain.name);
            }
        }
        else {

        }
    }

    public renderOnResponse (domains, callback: Function): void {
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
        this.selectionView = <SelectView>ViewRegistry.getEntry("SelectView").create(this.parent, domainsData);
        this.$el.find(".domain-selection").empty();
        this.$el.find(".domain-selection").append(this.selectionView.$el);

        var selectedDomain = domains[values.indexOf(this.selectedValue)];

        this.renderImg(selectedDomain.img);
        this.renderDescription(selectedDomain.description);
        this.renderApps(selectedDomain);
    }

    public render(callback?: Function): void {
        this.renderTmplEl();
        DomainsAdministration.requestDomains(
            (domains) => this.renderOnResponse(domains, callback)
        );
    }

    public registerEvents(): void {

    }
}