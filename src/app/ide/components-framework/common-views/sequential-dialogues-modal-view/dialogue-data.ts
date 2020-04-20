import {
    RenderPartsToPropertyData
} from "../../build-in.components/configuration/configuration-view/property-views/property-view";

function getRenderDataTitle(renderParts): any {
    let index = renderParts
        ? renderParts.map(x => x.type).indexOf("title")
        : -1;

    return index > -1
        ? renderParts[index]
        : null;
}

export function getTitleValueofRenderParts(renderParts): string {
    let data = getRenderDataTitle(renderParts);
    return (data && data.value.text) || "";
}

export function getTitleOfRenderParts(renderParts): string {
    let data = getRenderDataTitle(renderParts);
    return (data && (data.value.default || data.value.text)) || "";
}

function createDialogueTitle(action: string, renderParts, type) {
    let renderPartsTitle = getTitleOfRenderParts(renderParts);
    return action + (renderPartsTitle || type);
}

export function createDialogue(
    actionTitle: string,
    body: {
        formElems?: any,
        text?: any,
        systemIDs?: number
    },
    type,
    actions,
    dtype: string = "simple"
) {
    if (body.formElems) {
        body.formElems = RenderPartsToPropertyData(
            body.formElems,
            body.systemIDs);
    }
    return {
        type: dtype,
        data: {
            title: createDialogueTitle(
                actionTitle,
                body.formElems,
                type),
            body: body,
            actions: actions
        }
    };
}
