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

let CreateEditModal = function (selector) {
  let modal = CreateDOMElement("div", {
    classList: ["modal", "fade"],
    id: "edit-modal",
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
    id: "edit-modal-title",
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
    id: "edit-modal-body",
  });
  modalContent.appendChild(modalBody);

  // Name
  let outterInputDiv = CreateDOMElement("div", {
    classList: ["input-group", "mb-3"],
  });
  modalBody.appendChild(outterInputDiv);

  let inputGroup = CreateDOMElement("div", {
    classList: ["input-group-prepend"],
  });
  outterInputDiv.appendChild(inputGroup);

  let inputGroupNameTag = CreateDOMElement("div", {
    classList: ["input-group-text"],
    id: "resource-name-tag",
    innerHtml: "Name",
  });
  inputGroup.appendChild(inputGroupNameTag);

  let inputElementName = CreateDOMElement("input", {
    classList: ["form-control"],
    id: "edit-modal-nameInput",
  });
  inputElementName.setAttribute("aria-label", "edit-modal-nameInput");
  inputElementName.setAttribute("aria-describedby", "basic-addon1");
  outterInputDiv.appendChild(inputElementName);

  let formImage = CreateDOMElement("form");
  modalBody.appendChild(formImage);

  let formGroup = CreateDOMElement("div", { classList: ["form-group"] });
  formGroup.style.marginLeft = "0.3rem";
  formImage.appendChild(formGroup);

  // Image
  let labelImage = CreateDOMElement("label", { innerHtml: "Image" });
  labelImage.setAttribute("for", "edit-modal-imageInput");
  formGroup.appendChild(labelImage);

  let inputImage = CreateDOMElement("input", {
    classList: ["form-control-file"],
    id: "edit-modal-imageInput",
  });
  inputImage.setAttribute("type", "file");
  inputImage.setAttribute("accept", ".jpg,.png,.jpeg,.img");
  formGroup.appendChild(inputImage);

  // Color
  let outterColorDiv = CreateDOMElement("div", {
    classList: ["input-group", "mb-3"],
  });
  modalBody.appendChild(outterColorDiv);

  let inputGroupColor = CreateDOMElement("div", {
    classList: ["input-group-prepend"],
  });
  outterColorDiv.appendChild(inputGroupColor);

  let inputGroupColorTag = CreateDOMElement("div", {
    classList: ["input-group-text"],
    id: "edit-modal-color-tag",
    innerHtml: "Color",
  });
  inputGroupColor.appendChild(inputGroupColorTag);

  let inputColor = CreateDOMElement("input", {
    classList: ["form-control"],
    id: "edit-modal-colorInput",
  });
  inputColor.setAttribute("aria-label", "edit-modal-colorInput");
  inputColor.setAttribute("aria-describedby", "basic-addon1");
  inputColor.setAttribute("type", "color");
  outterColorDiv.appendChild(inputColor);

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
    id: "edit-modal-confirm-button",
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

let CreateDeleteModal = function (selector) {
  let modal = CreateDOMElement("div", {
    classList: ["modal", "fade"],
    id: "delete-modal",
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

  let modalBody = CreateDOMElement("div", {
    classList: ["modal-body"],
    id: "delete-modal-body",
  });
  modalContent.appendChild(modalBody);

  let modalFooter = CreateDOMElement("div", { classList: ["modal-footer"] });
  modalContent.appendChild(modalFooter);

  let closeButton = CreateDOMElement("button", {
    classList: ["btn", "btn-secondary"],
    innerHtml: "Close",
  });
  closeButton.setAttribute("type", "button");
  closeButton.setAttribute("data-dismiss", "modal");
  // closeButton.addEventListener('click', () => {
  //     onFail();
  // })
  modalFooter.appendChild(closeButton);

  let deleteButton = CreateDOMElement("div", {
    classList: ["btn", "btn-danger"],
    id: "delete-modal-confirm-button",
    innerHtml: "Delete",
  });
  deleteButton.setAttribute("type", "button");
  // deleteButton.addEventListener('click', () => {
  //     onSucess(elem);
  // })
  modalFooter.appendChild(deleteButton);
};

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

let RenderSmartGroupofObject = function (selector, group, onDeleteGroup) {
  let groupName = CreateDOMElement("span", {
    classList: ["badge", "badge-pill", "badge-secondary"],
    innerHtml: group.elemData.name,
  });
  groupName.style.padding = ".4rem";
  groupName.style.paddingLeft = ".5rem";
  groupName.style.fontSize = "medium";
  selector.appendChild(groupName);

  let groupIconSpan = CreateDOMElement("span", { classList: ["times"] });
  groupIconSpan.style.paddingLeft = ".2rem";
  groupIconSpan.style.paddingRight = ".2rem";
  groupName.appendChild(groupIconSpan);

  let groupIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-times-circle"],
  });
  groupIcon.onclick = () => {
    onDeleteGroup(group.elemData.name);
  };
  groupIconSpan.appendChild(groupIcon);
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
    innerHtml: "Export Group",
  });
  // group: { name, img, color, properties, mapPropsInfo, smartObject }
  exportGroupsButtonCol.onclick = () => {
    // Create Modal
    // CreateNewSmartGroupModal(
    //   document.getElementsByClassName("modal-platform-container")[0]
    // );
    // Destroy on close
    // $("#new-sg-modal").on("hidden.bs.modal", function () {
    //   document.getElementsByClassName("modal-platform-container")[0].innerHTML =
    //     "";
    // });
    // Render new group modal
    callbacksMap.onCreateSmartGroup(soData.editorData.details.properties);
    // callbacksMap.onCreateSmartGroup();
  };
  exportGroupsButtonCol.appendChild(exportGroupsButton);

  let groupsRow = CreateDOMElement("div", { classList: ["row"] });
  groupsRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(groupsRow);

  let groupsCol = CreateDOMElement("div", { classList: ["col-sm"] });
  groupsRow.appendChild(groupsCol);

  soData.editorData.details.groups.forEach((group) =>
    RenderSmartGroupofObject(groupsCol, group, callbacksMap.onDeleteGroup)
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

let RenderSmartObjectofGroup = function (
  selector,
  smartObject,
  onDeleteSmartObject
) {
  let smartObjectName = CreateDOMElement("span", {
    classList: ["badge", "badge-pill", "badge-secondary"],
    innerHtml: smartObject.elemData.name,
  });
  smartObjectName.style.padding = ".4rem";
  smartObjectName.style.paddingLeft = ".5rem";
  smartObjectName.style.fontSize = "medium";
  selector.appendChild(smartObjectName);

  let smartObjectIconSpan = CreateDOMElement("span", { classList: ["times"] });
  smartObjectIconSpan.style.paddingLeft = ".2rem";
  smartObjectIconSpan.style.paddingRight = ".2rem";
  smartObjectName.appendChild(smartObjectIconSpan);

  let smartObjectIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-times-circle"],
  });
  smartObjectIcon.onclick = () => {
    onDeleteSmartObject(smartObject);
  };
  smartObjectIconSpan.appendChild(smartObjectIcon);
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

  let smartObjectsRow = CreateDOMElement("div", { classList: ["row"] });
  smartObjectsRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(smartObjectsRow);

  let smartObjectsCol = CreateDOMElement("div", { classList: ["col-sm"] });
  smartObjectsRow.appendChild(smartObjectsCol);

  // for (const smartObject of sgData.editorData.details.smartObjects) {
  //   RenderSmartObjectofGroup(
  //     smartObjectsCol,
  //     smartObject,
  //     callbacksMap.onDeleteSmartObject
  //   );
  // }

  let deleteGroupRow = CreateDOMElement("div", { classList: ["row"] });
  deleteGroupRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(deleteGroupRow);

  let deleteGroupCol = CreateDOMElement("div", { classList: ["col-sm"] });
  deleteGroupRow.appendChild(deleteGroupCol);

  let deleteGroupButton = CreateDOMElement("button", {
    classList: ["btn", "btn-danger"],
    innerHtml: "Delete Group",
  });
  deleteGroupButton.onclick = callbacksMap.options.Delete;
  deleteGroupButton.style.cssFloat = "right";
  deleteGroupCol.appendChild(deleteGroupButton);
}
