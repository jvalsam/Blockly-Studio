import { URL } from "../../../shared/data";

export class DomainsAdministration {
    public static requestDomains(callback: (domains) => void): void {
        $.get(
            URL + "domains",
            (domains) => callback(domains)
        );
    }
}