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
    actionType: string,
    actionTitle: string,
    body: {
        formElems?: any,
        options?: any,
        text?: any,
        systemIDs?: number
    },
    type,
    actions,
    dtype: string = "simple"
) {
    let title = actionTitle;
    if (actionType !== 'create') {
        if (body.formElems) {
            let value = body.formElems
                .find(x=>x.type === 'title')
                .value;
            title += value.default || value.text;
        }
        else {
            title += type;
        }
    }

    if (body.formElems) {
        body.formElems = RenderPartsToPropertyData(
            body.formElems,
            body.systemIDs);
    }

    return {
        type: dtype,
        data: {
            title: title,
            body: body,
            actions: actions
        }
    };
}
