import * as soUIGenerator from "../../../../../../domains-libs/IoT/AutoIoTGen/iot-interfaces/dist/iot-ui";

// functionality
import { RenderSmartObject } from "./sovplelem-view";

let CreateDOMElement = function (type, options) {
  let element = document.createElement(type);

  if (options) {
    if (options.classList !== undefined) {
      options.classList.forEach((c) => {
        element.classList.add(c);
      });
    }
    if (options.id !== undefined) element.id = options.id;
    if (options.innerHtml !== undefined) element.innerHTML = options.innerHtml;
  }
  return element;
};

// functions for dialogues

// ...

let CreateEditPropertyAliasModal = function (selector) {
  let modal = CreateDOMElement("div", {
    classList: ["modal", "fade"],
    id: "editAlias-modal",
  });
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "true");
  selector.appendChild(modal);

  let modalDialog = CreateDOMElement("div", { classList: ["modal-dialog"] });
  modalDialog.setAttribute("role", "document");
  modal.appendChild(modalDialog);

  let modalContent = CreateDOMElement("div", { classList: ["modal-content"] });
  modalDialog.appendChild(modalContent);

  let modalHeader = CreateDOMElement("div", { classList: ["modal-header"] });
  modalContent.appendChild(modalHeader);

  let modalTitle = CreateDOMElement("h5", {
    classList: ["modal-title"],
    id: "editAlias-modal-title",
  });
  modalHeader.appendChild(modalTitle);

  let closeModal = CreateDOMElement("button", { classList: ["close"] });
  closeModal.setAttribute("type", "button");
  closeModal.setAttribute("data-dismiss", "modal");
  closeModal.setAttribute("aria-label", "Close");
  modalHeader.appendChild(closeModal);

  let closeSpan = CreateDOMElement("span");
  closeSpan.setAttribute("aria-hidden", "true");
  closeSpan.innerHTML = "&times;";
  closeModal.appendChild(closeSpan);

  let modalBody = CreateDOMElement("div", {
    classList: ["modal-body"],
    id: "editAlias-modal-body",
  });
  modalContent.appendChild(modalBody);

  // Alias
  let outterInputDiv = CreateDOMElement("div", {
    classList: ["input-group", "mb-3"],
  });
  modalBody.appendChild(outterInputDiv);

  let inputGroup = CreateDOMElement("div", {
    classList: ["input-group-prepend"],
  });
  outterInputDiv.appendChild(inputGroup);

  let inputGroupAliasTag = CreateDOMElement("div", {
    classList: ["input-group-text"],
    id: "editAlias-modal-alias-tag",
    innerHtml: "Name",
  });
  inputGroup.appendChild(inputGroupAliasTag);

  let inputPropertyAlias = CreateDOMElement("input", {
    classList: ["form-control"],
    id: "editAlias-modal-aliasInput",
  });
  inputPropertyAlias.setAttribute("aria-label", "editAlias-modal-aliasInput");
  inputPropertyAlias.setAttribute("aria-describedby", "basic-addon1");
  outterInputDiv.appendChild(inputPropertyAlias);

  let modalFooter = CreateDOMElement("div", { classList: ["modal-footer"] });
  modalContent.appendChild(modalFooter);

  let cancelButton = CreateDOMElement("button", {
    classList: ["btn", "btn-secondary"],
    innerHtml: "Cancel",
  });
  cancelButton.setAttribute("type", "button");
  // cancelButton.addEventListener('click', onFail);
  cancelButton.setAttribute("data-dismiss", "modal");
  modalFooter.appendChild(cancelButton);

  let confirmButton = CreateDOMElement("div", {
    classList: ["btn", "btn-primary"],
    id: "editAlias-modal-confirm-button",
    innerHtml: "Confirm",
  });
  confirmButton.setAttribute("type", "button");
  // confirmButton.addEventListener('click', () => {
  //     onSucess(
  //         {
  //             vplElement: elem,
  //             name: document.getElementById('resource-name').value,
  //             image: document.getElementById('resource-image').value,
  //             color: document.getElementById('resource-color').value
  //         });
  // });
  modalFooter.appendChild(confirmButton);
};

let CreateInputForModal = function (
  selector,
  inputName,
  inputType,
  inputId,
  inputWidth
) {
  let inputGroup = CreateDOMElement("div", {
    classList: ["input-group", "mb-3"],
  });
  inputGroup.style.width = inputWidth;
  selector.appendChild(inputGroup);

  let inputGroupPrepend = CreateDOMElement("div", {
    classList: ["input-group-prepend"],
  });
  inputGroup.appendChild(inputGroupPrepend);

  let span = CreateDOMElement("span", {
    classList: ["input-group-text"],
    id: "inputGroup-sizing-default",
    innerHtml: inputName,
  });
  inputGroupPrepend.appendChild(span);

  let input = CreateDOMElement("input", {
    classList: ["form-control"],
    id: inputId,
  });
  input.setAttribute("type", inputType);
  input.setAttribute("aria-label", inputName);
  input.setAttribute("aria-describedby", "inputGroup-sizing-default");
  inputGroup.appendChild(input);
};

let CreateSelectGroupsModal = function (selector) {
  let modal = CreateDOMElement("div", {
    classList: ["modal", "fade"],
    id: "select-group-modal",
  });
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "true");
  selector.appendChild(modal);

  let modalDialog = CreateDOMElement("div", { classList: ["modal-dialog"] });
  modalDialog.setAttribute("role", "document");
  modal.appendChild(modalDialog);

  let modalContent = CreateDOMElement("div", {
    classList: ["modal-content"],
  });
  modalDialog.appendChild(modalContent);

  let modalHeader = CreateDOMElement("div", { classList: ["modal-header"] });
  modalContent.appendChild(modalHeader);

  let modalTitle = CreateDOMElement("h5", {
    classList: ["modal-title"],
    id: "select-group-modal-title",
    innerHtml: "Create new group: ",
  });
  modalHeader.appendChild(modalTitle);

  let closeModal = CreateDOMElement("button", { classList: ["close"] });
  closeModal.setAttribute("type", "button");
  closeModal.setAttribute("data-dismiss", "modal");
  closeModal.setAttribute("aria-label", "Close");
  modalHeader.appendChild(closeModal);

  let closeSpan = CreateDOMElement("span");
  closeSpan.setAttribute("aria-hidden", "true");
  closeSpan.innerHTML = "&times;";
  closeModal.appendChild(closeSpan);

  let modalBody = CreateDOMElement("div", {
    classList: ["modal-body"],
    id: "new-sg-modal-body",
  });
  modalContent.appendChild(modalBody);

  CreateInputForModal(modalBody, "Name", "text", "sg-name", "29rem");
  CreateInputForModal(modalBody, "Image", "file", "sg-image", "29rem");
  CreateInputForModal(modalBody, "Color", "color", "sg-color", "8rem");

  let propertiesHeader = CreateDOMElement("span", {
    classList: ["font-weight-bold"],
    innerHtml: "Properties",
  });
  propertiesHeader.style.fontSize = "large";
  modalBody.appendChild(propertiesHeader);

  let propertiesContainer = CreateDOMElement("div", {
    classList: ["container-fluid", "overflow-auto"],
    id: "select-group-modal-properties-container",
  });
  propertiesContainer.style.paddingTop = ".5rem";
  propertiesContainer.style.maxHeight = "21rem";
  propertiesContainer.style.marginTop = ".5rem";
  propertiesContainer.style.backgroundColor = "#f7f7f7";
  modalBody.appendChild(propertiesContainer);

  let modalFooter = CreateDOMElement("div", { classList: ["modal-footer"] });
  modalContent.appendChild(modalFooter);

  let cancelButton = CreateDOMElement("button", {
    classList: ["btn", "btn-secondary"],
    innerHtml: "Cancel",
  });
  cancelButton.setAttribute("type", "button");
  // cancelButton.addEventListener('click', onFail);
  cancelButton.setAttribute("data-dismiss", "modal");
  modalFooter.appendChild(cancelButton);

  let confirmButton = CreateDOMElement("div", {
    classList: ["btn", "btn-primary"],
    id: "select-group-modal-confirm-button",
    innerHtml: "Confirm",
  });
  confirmButton.setAttribute("type", "button");
  modalFooter.appendChild(confirmButton);
};

export function RenderSelectGroupsModal(
  sovplelemInst,
  groups,
  onSuccess, // (groups: Array<String>, updatedAliases: Array<{old: string, new: string}>)
  onSkip
) {
  // // Create Modal
  // CreateSelectGroupsModal(
  //   document.getElementsByClassName("modal-platform-container")[0]
  // );
  // // Destroy on close
  // $("#select-group-modal").on("hidden.bs.modal", function () {
  //   document.getElementsByClassName("modal-platform-container")[0].innerHTML =
  //     "";
  // });
  onSuccess([], []);
  // $("#select-group-modal").modal("show");
}

let FilterRegisteredDevicesForScan = function (
  registeredDevices, // {id: "..."}
  scannedDevices
) {
  let result = scannedDevices.filter(
    (el) => !registeredDevices.map((x) => x.id).includes(el.id)
  );
  return result;
};

// functions for rendering parts
export function RenderSOScanList(
  selector,
  filteredResources,
  registeredDevices,
  onRegister
) {
  // Render Scan Button
  soUIGenerator.RenderScanButton(selector, (resources) => {
    selector.innerHTML = "";
    RenderSOScanList(
      selector,
      FilterRegisteredDevicesForScan(
        registeredDevices,
        resources.scannedResources //{ scannedResources, registeredResources} from iotivity
      ),
      registeredDevices,
      onRegister
    );
  });

  // Create row
  let rowDiv = CreateDOMElement("div", {
    classList: ["row", "justify-content-center"],
  });
  selector.appendChild(rowDiv);

  // Create col
  let colDiv = CreateDOMElement("div", { classList: ["col"] });
  rowDiv.appendChild(colDiv);

  // Create div for list
  let listDiv = CreateDOMElement("div", {
    classList: ["list-group", "scan-list"],
  });
  colDiv.appendChild(listDiv);

  // Create List Element
  for (const resource of filteredResources) {
    soUIGenerator.RenderScannedResourceInScanList(
      listDiv,
      resource,
      () => {
        onRegister(resource);
      },
      true
    );
  }
}

let RenderSmartElements = function (selector, smartElements, onDelete) {
  for (const smartElement of smartElements) {
    RenderSmartElementBelongsToAnotherElem(selector, smartElement, onDelete);
  }
};

let RenderSmartElementBelongsToAnotherElem = function (
  selector,
  smartElement,
  onClickAtElement,
  onDeleteSmartElement
) {
  let button = CreateDOMElement("button", {
    classList: ["badge", "badge-pill", "badge-secondary", "bubbles"],
    innerHtml: smartElement.name,
  });
  // button.style.padding = ".4rem";
  button.style.paddingRight = "2rem";
  button.style.lineHeight = "17px";
  button.onclick = () => {
    // onClickAtElement(smartElement)
  };
  selector.appendChild(button);

  let buttonIconSpan = CreateDOMElement("span", { classList: ["times"] });
  buttonIconSpan.style.position = "absolute";
  buttonIconSpan.style.marginLeft = "-1.5rem";
  buttonIconSpan.style.marginTop = "0.75rem";
  buttonIconSpan.style.color = "white";

  buttonIconSpan.onclick = () => {
    // onDeleteSmartElement(smartElement);
  };
  selector.appendChild(buttonIconSpan);

  let buttonIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-times-circle"],
  });
  buttonIconSpan.appendChild(buttonIcon);
};

// Smart Object Renderer
let RenderSmartObjectProperty = function (
  selector,
  id,
  property,
  alias,
  callbacks
) {
  soUIGenerator.RenderReadOnlyProperty(
    selector,
    id,
    property,
    "smartObject",
    alias,
    callbacks
  );
};

let RenderSmartObjectRegistered = function (
  selector,
  soData,
  projectComponentsData,
  callbacksMap
) {
  console.log(soData);
  let cardDiv = soUIGenerator.RenderCard({
    selector: selector,
    id: soData.editorData.editorId,
  });

  // Card Header
  // soUIGenerator.RenderCardHeader({
  //   selector: cardDiv,
  //   name: soData.name,
  //   id: soData.editorData.editorId,
  //   image: soData.img,
  //   onEdit: callbacksMap.options.Edit,
  //   onDelete: callbacksMap.options.Delete,
  // });

  // Card Body
  let cardBodyDiv = CreateDOMElement("div", {
    classList: ["card-body"],
    id: soData.editorData.editorId + "-body",
  });
  cardDiv.appendChild(cardBodyDiv);

  // Environment
  let environmentRow = CreateDOMElement("div", { classList: ["row"] });
  environmentRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(environmentRow);

  let environmentName = CreateDOMElement("div", {
    classList: ["col-sm-6", "font-weight-bold"],
    innerHtml: "Environment",
  });
  environmentName.style.fontSize = "large";
  environmentName.style.marginTop = "auto";
  environmentName.style.marginBottom = "auto";
  environmentRow.appendChild(environmentName);

  let environmentSelectCol = CreateDOMElement("div", {
    classList: ["col-sm-6"],
  });
  environmentRow.appendChild(environmentSelectCol);

  let environmentSelect = CreateDOMElement("select", {
    classList: ["form-control"],
  });
  environmentSelect.style.maxWidth = "7rem";
  environmentSelectCol.appendChild(environmentSelect);

  let environmentOption = CreateDOMElement("option", { innerHtml: "Home" });
  environmentSelect.appendChild(environmentOption);

  let hrEnvProp = CreateDOMElement("hr");
  cardBodyDiv.appendChild(hrEnvProp);

  // Properties
  let propertiesRow = CreateDOMElement("div", { classList: ["row"] });
  propertiesRow.style.marginTop = "2rem";
  cardBodyDiv.appendChild(propertiesRow);

  let propertiesCol = CreateDOMElement("div", { classList: ["col-sm"] });
  propertiesRow.appendChild(propertiesCol);

  let propertiesHeader = CreateDOMElement("span", {
    classList: ["font-weight-bold"],
    innerHtml:
      "Properties (" + soData.editorData.details.properties.length + ")",
  });
  propertiesHeader.style.fontSize = "large";
  propertiesCol.appendChild(propertiesHeader);

  let propertiesContainer = CreateDOMElement("div", {
    classList: ["container-fluid", "overflow-auto"],
  });
  propertiesContainer.style.paddingTop = ".5rem";
  propertiesContainer.style.maxHeight = "21rem";
  propertiesContainer.style.marginTop = ".5rem";
  propertiesContainer.style.backgroundColor = "#f7f7f7";
  cardBodyDiv.appendChild(propertiesContainer);

  for (const property of soData.editorData.details.properties) {
    RenderSmartObjectProperty(
      propertiesContainer,
      soData.editorData.editorId,
      property,
      soData.editorData.details.mapPropsAlias[property.name],
      {
        onEditPropertyAlias: callbacksMap.onEditPropertyAlias,
        onEditPropertyProgrammingActive:
          callbacksMap.onEditPropertyProgrammingActive,
      }
    );
  }

  let hrPropGroups = CreateDOMElement("hr");
  cardBodyDiv.appendChild(hrPropGroups);

  // Groups
  let groupsHeaderRow = CreateDOMElement("div", { classList: ["row"] });
  groupsHeaderRow.style.marginTop = "2rem";
  cardBodyDiv.appendChild(groupsHeaderRow);

  let groupsName = CreateDOMElement("div", {
    classList: ["col-sm-8", "font-weight-bold"],
    innerHtml: "Groups",
  });
  groupsName.style.fontSize = "large";
  groupsName.style.marginTop = "auto";
  groupsName.style.marginBottom = "auto";
  groupsHeaderRow.appendChild(groupsName);

  let exportGroupsButtonCol = CreateDOMElement("div", {
    classList: ["col-sm"],
  });
  exportGroupsButtonCol.style.textAlign = "right";
  groupsHeaderRow.appendChild(exportGroupsButtonCol);

  let exportGroupsButton = CreateDOMElement("button", {
    classList: ["btn", "btn-info"],
    innerHtml: "Create Group",
  });
  exportGroupsButtonCol.onclick = () => {
    callbacksMap.onCreateSmartGroup({
      properties: soData.editorData.details.properties,
      soDataID: soData.editorData.editorId,
      soName: soData.name,
    });
  };
  exportGroupsButtonCol.appendChild(exportGroupsButton);

  // let groupsRow = CreateDOMElement("div", { classList: ["row"] });
  // groupsRow.style.marginTop = "1rem";
  // cardBodyDiv.appendChild(groupsRow);

  // let groupsCol = CreateDOMElement("div", { classList: ["col-sm"] });
  // groupsCol.style.marginLeft = "-1.5rem";
  // groupsRow.appendChild(groupsCol);

  let groupDiv = CreateDOMElement("div");
  groupDiv.style.marginLeft = "-1.5rem";
  groupDiv.style.marginTop = "1.5rem";
  cardBodyDiv.appendChild(groupDiv);

  RenderSmartElements(
    groupDiv,
    soData.editorData.details.groups,
    callbacksMap.onDeleteGroup
  );
};

let RenderSmartObjectUnregistered = function (
  selector,
  soData,
  projectComponentsData,
  callbacksMap
) {
  let scanContainer = document.createElement("div");
  scanContainer.classList.add("container");
  scanContainer.style.overflowY = "auto";
  scanContainer.style.maxHeight = "50rem";
  selector.appendChild(scanContainer);

  let row = document.createElement("div");
  row.classList.add("row");
  scanContainer.appendChild(row);

  let col = document.createElement("div");
  col.classList.add("col");
  row.appendChild(col);

  // render message for unregistered smart object
  soUIGenerator.RenderScanButton(col, (resources) => {
    if (!projectComponentsData.registeredDevices) {
      projectComponentsData.registeredDevices = [];
    }
    // Clear col
    col.innerHTML = "";
    RenderSOScanList(
      col,
      FilterRegisteredDevicesForScan(
        projectComponentsData.registeredDevices,
        resources.scannedResources //{ scannedResources, registeredResources} from iotivity
      ),
      projectComponentsData.registeredDevices,
      (resource) => {
        // Save data
        callbacksMap.onRegister(resource.properties, resource.id);
        // Update UI
        selector.innerHTML = "";
        RenderSmartObject(
          selector,
          soData,
          projectComponentsData,
          callbacksMap
        );
      }
    );
  });

  let messageRow = document.createElement("div");
  messageRow.classList.add("row");
  col.appendChild(messageRow);

  let messageDiv = document.createElement("div");
  messageDiv.style.marginLeft = "auto";
  messageDiv.style.marginRight = "auto";
  messageDiv.style.marginTop = "2rem";
  messageRow.appendChild(messageDiv);

  let unregisterSpan = document.createElement("span");
  unregisterSpan.innerHTML = "Unregistered Smart Object.";
  unregisterSpan.style.color = "red";
  unregisterSpan.style.fontSize = "large";
  messageDiv.appendChild(unregisterSpan);

  let pressScanSpan = document.createElement("span");
  pressScanSpan.innerHTML = "  Press Scan Button";
  pressScanSpan.style.fontSize = "large";
  messageDiv.appendChild(pressScanSpan);
};

let RenderSmartObjectInvalid = function (
  selector,
  soData,
  projectComponentsData,
  callbacksMap
) {
  // render message for invalid smart object
  // filtered scan
  // TODO
};

let RenderSmartObjectDispatchFunc = {
  Registered: RenderSmartObjectRegistered,
  Unregistered: RenderSmartObjectUnregistered,
  Invalid: RenderSmartObjectInvalid,
};

export function RenderSmartObject(
  selector,
  soData,
  projectComponentsData,
  callbacksMap
) {
  RenderSmartObjectDispatchFunc[soData.editorData.details.state](
    selector,
    soData,
    projectComponentsData,
    callbacksMap
  );
}

// Smart Group Renderer
let RenderSmartGroupProperty = function (
  selector,
  id,
  property,
  alias,
  callbacks
) {
  soUIGenerator.RenderReadOnlyProperty(
    selector,
    id,
    property,
    "smartGroup",
    alias,
    callbacks
  );
};

export function RenderSmartGroup(
  selector,
  sgData,
  projectComponentsData,
  callbacksMap
) {
  console.log(sgData);
  let cardDiv = soUIGenerator.RenderCard({
    selector: selector,
    id: sgData.editorData.editorId,
  });

  // Card Body
  let cardBodyDiv = CreateDOMElement("div", {
    classList: ["card-body"],
    id: sgData.editorData.editorId + "-body",
  });
  cardDiv.appendChild(cardBodyDiv);

  // Properties
  let propertiesRow = CreateDOMElement("div", { classList: ["row"] });
  propertiesRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(propertiesRow);

  let propertiesCol = CreateDOMElement("div", { classList: ["col-sm"] });
  propertiesRow.appendChild(propertiesCol);

  let propertiesHeader = CreateDOMElement("span", {
    classList: ["font-weight-bold"],
    innerHtml:
      "Properties (" + sgData.editorData.details.properties.length + ")",
  });
  propertiesHeader.style.fontSize = "large";
  propertiesCol.appendChild(propertiesHeader);

  let propertiesContainer = CreateDOMElement("div", {
    classList: ["container-fluid", "overflow-auto"],
  });
  propertiesContainer.style.maxHeight = "21rem";
  propertiesContainer.style.marginTop = ".5rem";
  propertiesContainer.style.backgroundColor = "#f7f7f7";
  cardBodyDiv.appendChild(propertiesContainer);

  for (const property of sgData.editorData.details.properties) {
    RenderSmartGroupProperty(
      propertiesContainer,
      sgData.editorData.editorId,
      property,
      sgData.editorData.details.mapPropsAlias[property.name],
      {
        onEditPropertyAlias: callbacksMap.onEditPropertyAlias,
        onEditPropertyActive: callbacksMap.onEditPropertyActive,
      }
    );
  }

  let resetRow = CreateDOMElement("div", { classList: ["row"] });
  resetRow.style.marginTop = ".5rem";
  cardBodyDiv.appendChild(resetRow);

  let resetCol = CreateDOMElement("div", { classList: ["col-sm"] });
  resetRow.appendChild(resetCol);

  let resetButton = CreateDOMElement("button", {
    classList: ["btn", "btn-outline-secondary"],
    innerHtml: "Reset",
  });
  resetButton.onclick = () => {
    callbacksMap.onReset(sgData.editorData.details.properties);
  };
  resetButton.style.cssFloat = "right";
  resetButton.style.marginRight = "2rem";
  resetRow.appendChild(resetButton);

  // Smart Objects
  let smartObjectsHeaderRow = CreateDOMElement("div", { classList: ["row"] });
  smartObjectsHeaderRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(smartObjectsHeaderRow);

  let smartObjectsName = CreateDOMElement("div", {
    classList: ["col-sm", "font-weight-bold"],
    innerHtml: "Smart Objects",
  });
  smartObjectsName.style.fontSize = "large";
  smartObjectsName.style.marginTop = "auto";
  smartObjectsName.style.marginBottom = "auto";
  smartObjectsHeaderRow.appendChild(smartObjectsName);

  // let smartObjectsRow = CreateDOMElement("div", { classList: ["row"] });
  // smartObjectsRow.style.marginTop = "1rem";
  // cardBodyDiv.appendChild(smartObjectsRow);

  // let smartObjectsCol = CreateDOMElement("div", { classList: ["col-sm"] });
  // smartObjectsCol.style.marginLeft = "-1.5rem";
  // smartObjectsRow.appendChild(smartObjectsCol);
  
  let objectDiv = CreateDOMElement("div");
  objectDiv.style.marginLeft = "-1.5rem";
  cardBodyDiv.appendChild(objectDiv);

  RenderSmartElements(
    objectDiv,
    sgData.editorData.details.smartObjects,
    callbacksMap.onDeleteSmartObject
  );
}
