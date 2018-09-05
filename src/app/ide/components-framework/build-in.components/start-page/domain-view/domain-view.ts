import { ViewRegistry } from './../../../component/registry';
import { ISelectData } from './../../configuration/configuration-view/property-views/select-view/select-view';
/// <reference path="../../../../../../../node.d.ts"/>
import DomainTmpl from "./domain-view.tmpl";
import { IViewUserStyleData } from "../../../component/view";
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
        protected readonly _templateHTML: string,
        protected _style: Array<IViewUserStyleData>,
        protected _selector: string
    ) {
        super(parent, name, _templateHTML, _style, _selector);
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
        $(".domain-image").empty();
        $(".domain-image").append(img);
    }

    private renderDescription(description): void {
        $(".domain-description").empty();
        $(".domain-description").append(description);
    }

    private renderApps(selectedDomain): void {
        if (selectedDomain.type === "programming") {
            if (this.domainsAppsView === null) {
                this.domainsAppsView = <ApplicationListSP>ViewRegistry.getEntry("ApplicationsListStartPage").create(
                    this.parent,
                    ".domain-applications",
                    { domain: selectedDomain, filters: { domainType: selectedDomain.name } }
                );
                this.domainsAppsView.render();
            }
            else {
                this.domainsAppsView.setDomain(selectedDomain);
            }
        }
        else {
            this.domainsAppsView.destroy();
            delete this.domainsAppsView;
            this.domainsAppsView = null;
        }
    }

    public renderOnResponse (domains): void {
        let values = domains.map(x=>x.title);
        this.selectedValue = this.selectedValue ? this.selectedValue : values[0];
        let domainsData: ISelectData = {
            name: "Domain",
            style: "",
            selected: this.selectedValue,
            values: values,
            type: "aggregate",
            renderName: true,
            indepedent: true,
            updateParent: (selected: string) => {
                this.selectedValue = selected;
                this.renderOnResponse (domains);
            }
        };
        this.selectionView = <SelectView>ViewRegistry.getEntry("SelectView").create(this.parent, ".domain-selection", domainsData);
        this.selectionView.style = {
            Family: "inherit",
            Size: "1.5rem",
            Style: "normal",
            Weight: "500",
            "Text Colour": "inherit"
        };
        this.selectionView.render();

        var selectedDomain = domains[values.indexOf(this.selectedValue)];

        this.renderImg(selectedDomain.img);
        this.renderDescription(selectedDomain.description);

        this.renderApps(selectedDomain);
    }

    public render(): void {
        this.renderTmplEl();
        DomainsAdministration.requestDomains(
            (domains) => this.renderOnResponse(domains)
        );
    }

    public registerEvents(): void {}
}