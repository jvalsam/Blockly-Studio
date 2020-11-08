import * as soUIGenerator from "../../../../../../domains-libs/IoT/AutoIoTGen/Automatic_Interfaces_IoT/server/app/public/dist/bundle";

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

// export function DialogueSelectGroups(groups, onSucess, onFail) {

// }

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

let CreateNewSmartGroupModal = function (selector) {
  let modal = CreateDOMElement("div", {
    classList: ["modal", "fade"],
    id: "newGroup-modal",
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
    id: "newGroup-modal-title",
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
    id: "newGroup-modal-body",
  });
  modalContent.appendChild(modalBody);

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
    id: "newGroup-modal-confirm-button",
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

// functions for rendering parts

let CreateResourceDetails = function (selector, resourceData) {
  // Name in details
  let detailsNameRow = CreateElement("div", {
    classList: ["row", "mt-1", "ml-2", "bd-highlight"],
  });
  outterDiv.appendChild(detailsNameRow);

  let detailsNameTag = CreateElement("div", {
    classList: ["col-sm-4", "font-weight-bold"],
    innerHtml: "Name:",
  });
  detailsNameRow.appendChild(detailsNameTag);

  let detailsName = CreateElement("div", {
    classList: ["col", "text-truncate"],
    innerHtml: resourceData.name,
  });
  //tooltip for name
  detailsName.setAttribute("data-toggle", "tooltip");
  detailsName.setAttribute("data-placement", "bottom");
  detailsName.setAttribute("title", resourceData.name);
  detailsNameRow.appendChild(detailsName);

  outterDiv.appendChild(CreateElement("hr", { classList: ["my-hr"] }));

  // ID in details
  let detailsIdRow = CreateElement("div", {
    classList: ["row", "ml-2", "bd-highlight"],
  });
  outterDiv.appendChild(detailsIdRow);

  let detailsIdTag = CreateElement("div", {
    classList: ["col-sm-4", "font-weight-bold"],
    innerHtml: "ID:",
  });
  detailsIdRow.appendChild(detailsIdTag);

  let detailsId = CreateElement("div", {
    classList: ["col", "text-truncate"],
    innerHtml: resourceData.id,
  });
  //tooltip for id
  detailsId.setAttribute("data-toggle", "tooltip");
  detailsId.setAttribute("data-placement", "bottom");
  detailsId.setAttribute("title", resourceData.id);
  detailsIdRow.appendChild(detailsId);

  outterDiv.appendChild(CreateElement("hr", { classList: ["my-hr"] }));

  // Properties in details
  let propertiesRow = CreateElement("div", {
    classList: ["row", "mt-1", "ml-2", "bd-highlight"],
  });
  outterDiv.appendChild(propertiesRow);

  let propertiesTag = CreateElement("div", {
    classList: ["col-sm-5", "font-weight-bold"],
    innerHtml: "Properties: ",
  });
  propertiesRow.appendChild(propertiesTag);

  // Table of Properties
  let propertiesTable = CreateElement("table", {
    classList: ["table-responsive-sm", "table-striped", "ml-4", "mt-3"],
  });
  outterDiv.appendChild(propertiesTable);

  let tableBody = CreateElement("tbody");
  propertiesTable.appendChild(tableBody);

  // Create properties of resource
  _.forIn(resourceData.properties, (prop) => {
    let propertyRow = CreateElement("tr");
    tableBody.appendChild(propertyRow);

    let propertyName = CreateElement("td", {
      classList: ["pt-2", "pb-2"],
      innerHtml: prop.name,
    });
    propertyRow.appendChild(propertyName);

    let propertyValue = CreateElement("td", {
      classList: ["pt-2", "pb-2"],
      innerHtml: prop.value,
    });
    propertyRow.appendChild(propertyValue);
  });
};

let RenderSOInScanList = function (selector, soData, onRegister) {
  let resourceDiv = CreateDOMElement("div", {
    classList: ["ml-auto", "mr-auto"],
    id: soData.editorData.id + "-accordion",
  });
  listDiv.appendChild(resourceDiv);

  // Card
  let card = CreateDOMElement("div", {
    classList: ["card", "list-group-item"],
  });
  resourceDiv.appendChild(card);

  let rowDiv = CreateDOMElement("div", { classList: ["row", "h-100"] });
  card.appendChild(rowDiv);

  // Name in card-header
  let nameCol = CreateDOMElement("div", {
    classList: ["col-sm-7", "my-auto", "h6", "text-truncate"],
    innerHtml: soData.name,
  });
  //tooltip for name
  nameCol.setAttribute("data-toggle", "tooltip");
  nameCol.setAttribute("data-placement", "bottom");
  nameCol.setAttribute("title", soData.name);
  rowDiv.appendChild(nameCol);

  // if (soData.editorData.details.state === SmartObjectState.UNR)

  // Register button in card-header
  let buttonCol = CreateDOMElement("div", {
    classList: ["col-sm-5", "my-auto"],
  });
  rowDiv.appendChild(buttonCol);

  let button = CreateDOMElement("button", {
    classList: ["btn", "btn-success", "float-right", "my-auto"],
    id: soData.editorData.id + "-register",
    innerHtml: "Register",
  });
  // button.setAttribute('onclick', 'RegisterResource(\'' + resource.id + '\');');
  button.addEventListener("click", () => {
    onRegister(soData.editorData.details.properties);
  });
  buttonCol.appendChild(button);

  // else
  // button disabled

  // Details
  let detailsRow = CreateDOMElement("div", {
    classList: ["row", "h-100", "d-flex", "justify-content-center"],
  });
  card.appendChild(detailsRow);

  let resourceDetails = CreateDOMElement("div", {
    classList: ["fas", "fa-lg", "fa-angle-down", "collapsed"],
  });
  resourceDetails.setAttribute("type", "button");
  resourceDetails.setAttribute("data-toggle", "collapse");
  resourceDetails.setAttribute(
    "data-target",
    soData.editorData.details.id + "-collapse"
  );
  resourceDetails.setAttribute("aria-expanded", "false");
  resourceDetails.setAttribute(
    "aria-controls",
    soData.editorData.details.id + "-collapse"
  );
  detailsRow.appendChild(resourceDetails);

  // Collapse for card
  let detailsCollapse = CreateDOMElement("div", {
    classList: ["collapse", "mt-2"],
    id: soData.editorData.id + "-collapse",
  });
  detailsCollapse.setAttribute("aria-labelledby", soData.editorData.id);
  detailsCollapse.setAttribute(
    "data-parent",
    soData.editorData.id + "-accordion"
  );
  card.appendChild(detailsCollapse);

  let detailsBody = CreateDOMElement("div", {
    classList: [
      "card-body",
      "d-flex",
      "flex-column",
      "bd-highlight",
      "bg-light",
    ],
  });
  detailsCollapse.appendChild(detailsBody);

  CreateResourceDetails(detailsBody, soData.editorData.details);
};

export function RenderSOScanList(selector, resources, onRegister) {
  // Render Scan Button
  soUIGenerator.RenderScanButton(selector, (resources) => {
    selector.innerHTML = "";
    RenderSOScanList(selector, resources, (resource) => {
      selector.innerHTML = "";
    });
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
  for (const resource of resources.scannedResources) {
    soUIGenerator.RenderScannedResourceInScanList(listDiv, resource, () => {
      onRegister(resource);
    });
  }
}

// Smart Object Renderer
let RenderSmartObjectProperty = function (
  selector,
  property,
  alias,
  callbacks
) {
  let propertyRow = CreateDOMElement("div", {
    classList: ["row", "align-items-center", "resource-property"],
  });
  selector.appendChild(propertyRow);

  let propertyNameCol = CreateDOMElement("div", {
    classList: ["col-sm-6", "property-title", "text-truncate"],
    innerHtml: property.name,
  });
  propertyRow.appendChild(propertyNameCol);

  let propertyName = CreateDOMElement("div", { classList: ["text-truncate"] });
  propertyName.setAttribute("data-toggle", "tooltip");
  propertyName.setAttribute("data-placement", "bottom");
  propertyName.setAttribute("title", property.name);
  propertyNameCol.appendChild(propertyName);

  let propertyAliasOuterDiv = CreateDOMElement("div");
  propertyAliasOuterDiv.style.fontSize = "small";
  propertyNameCol.appendChild(propertyAliasOuterDiv);

  let propertyAliasHeader = CreateDOMElement("span", { innerHtml: "alias: " });
  propertyAliasOuterDiv.appendChild(propertyAliasHeader);

  let propertyAliasValue = CreateDOMElement("span", { innerHtml: alias });
  propertyAliasValue.style.fontStyle = "italic";
  propertyAliasOuterDiv.appendChild(propertyAliasValue);

  let propertyValueCol = CreateDOMElement("div", { classList: ["col-sm-3"] });
  propertyRow.appendChild(propertyValueCol);

  let propertyValue = CreateDOMElement("input", {
    classList: ["form-control", "property-value-string"],
  });
  propertyValue.setAttribute("type", "text");
  propertyValue.setAttribute("value", property.value);
  propertyValue.setAttribute("readonly", property.read_only);
  propertyValueCol.appendChild(propertyValue);

  let propertyHideCol = CreateDOMElement("div", { classList: ["col-sm-1"] });
  propertyRow.appendChild(propertyHideCol);

  let propertyHideIcon = CreateDOMElement("i", {
    classList: ["far", "fa-eye", "fa-lg"],
  });
  propertyHideIcon.addEventListener("click", () => {
    callbacks.onEditPropertyProgrammingActive(property);
  });
  propertyHideCol.appendChild(propertyHideIcon);

  let propertyEditCol = CreateDOMElement("div", { classList: ["col-sm-1"] });
  propertyEditCol.style.paddingRight = ".5rem";
  propertyRow.appendChild(propertyEditCol);

  let propertyEditIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-edit", "fa-lg"],
  });
  propertyEditIcon.addEventListener("click", () => {
    callbacks.onEditPropertyAlias(property);
  });
  propertyEditCol.appendChild(propertyEditIcon);
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
  groupIcon.addEventListener("click", () => {
    onDeleteGroup(group.elemData.name);
  });
  groupIconSpan.appendChild(groupIcon);
};

let RenderSmartObjectRegistered = function (selector, soData, callbacksMap) {
  console.log(soData);

  let cardDiv = CreateDOMElement("div", {
    classList: ["card", "text-left"],
    id: soData.editorData.editorId,
  });
  cardDiv.style.width = "33rem";
  cardDiv.style.maxHeight = "45rem";
  selector.appendChild(cardDiv);

  // Card Header
  let cardHeaderDiv = CreateDOMElement("div", { classList: ["card-header"] });
  cardDiv.appendChild(cardHeaderDiv);

  let colHeaderDiv = CreateDOMElement("div", { classList: ["col"] });
  colHeaderDiv.style.display = "inline-flex";
  cardHeaderDiv.appendChild(colHeaderDiv);

  let resourceHeader = CreateDOMElement("div", { innerHtml: soData.name });
  resourceHeader.style.fontSize = "large";
  colHeaderDiv.appendChild(resourceHeader);

  // Render image
  if (soData.img) {
    let resourceImg = CreateDOMElement("img", { classList: ["resource-img"] });
    resourceImg.setAttribute("src", soData.img);
    resourceImg.style.width = "24px";
    resourceImg.style.height = "24px";
    colHeaderDiv.appendChild(resourceImg);
  }

  // DropDown Menu
  let colMenuDiv = CreateDOMElement("div", { classList: ["col"] });
  colMenuDiv.style.marginLeft = "2rem";
  cardHeaderDiv.appendChild(colMenuDiv);

  let dropDownImg = CreateDOMElement("i", {
    classList: [
      "dropdown-toggle",
      "float-right",
      "resource-menu",
      "fas",
      "fa-ellipsis-v",
    ],
    id: soData.editorData.id + "-menu",
  });
  dropDownImg.setAttribute("data-toggle", "dropdown");
  dropDownImg.setAttribute("aria-haspopup", "true");
  dropDownImg.setAttribute("aria-expanded", "false");
  colMenuDiv.appendChild(dropDownImg);

  let dropDownMenu = CreateDOMElement("div", { classList: ["dropdown-menu"] });
  dropDownMenu.setAttribute("aria-labelledby", soData.editorData.id + "-menu");
  colMenuDiv.appendChild(dropDownMenu);

  let editSelect = CreateDOMElement("a", {
    classList: ["dropdown-item"],
    id: soData.editorData.id + "-edit",
    innerHtml: "Edit",
  });
  editSelect.addEventListener("click", callbacksMap.options.Edit);
  dropDownMenu.appendChild(editSelect);

  let deleteSelect = CreateDOMElement("a", {
    classList: ["dropdown-item"],
    id: soData.editorData.id + "-delete",
    innerHtml: "Delete",
  });
  deleteSelect.addEventListener("click", callbacksMap.options.Delete);
  dropDownMenu.appendChild(deleteSelect);

  // Card Body
  let cardBodyDiv = CreateDOMElement("div", {
    classList: ["card-body"],
    id: soData.editorData.id + "-resource-body",
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
  propertiesContainer.style.maxHeight = "21rem";
  propertiesContainer.style.marginTop = ".5rem";
  propertiesContainer.style.backgroundColor = "#f7f7f7";
  cardBodyDiv.appendChild(propertiesContainer);

  _.forEach(soData.editorData.details.properties, (property) => {
    RenderSmartObjectProperty(
      propertiesContainer,
      property,
      soData.editorData.details.mapPropsAlias[property.name],
      {
        onEditPropertyAlias: callbacksMap.onEditPropertyAlias,
        onEditPropertyProgrammingActive:
          callbacksMap.onEditPropertyProgrammingActive,
      }
    );
  });

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
  groupsHeaderRow.appendChild(exportGroupsButtonCol);

  let exportGroupsButton = CreateDOMElement("button", {
    classList: ["btn", "btn-info"],
    innerHtml: "Export Group",
  });
  // group: { name, img, color, properties, mapPropsInfo, smartObject }
  exportGroupsButtonCol.addEventListener("click", () => {
    callbacksMap.onCreateSmartGroup();
  });
  exportGroupsButtonCol.appendChild(exportGroupsButton);

  let groupsRow = CreateDOMElement("div", { classList: ["row"] });
  groupsRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(groupsRow);

  let groupsCol = CreateDOMElement("div", { classList: ["col-sm"] });
  groupsRow.appendChild(groupsCol);

  _.forEach(soData.editorData.details.groups, (group) => {
    RenderSmartGroupofObject(groupsCol, group, callbacksMap.onDeleteGroup);
  });
};

let RenderSmartObjectUnregistered = function (selector, soData, callbacksMap) {
  // render message for unregistered smart object
  soUIGenerator.RenderScanButton(selector, (resources) => {
    // Clear save button
    selector.innerHTML = "";
    RenderSOScanList(selector, resources, (resource) => {
      // Save data
      callbacksMap.onRegister(resource.properties);
      // Update UI
      selector.innerHTML = "";
      RenderSmartObject(selector, soData, callbacksMap);
    });
  });
  let message = document.createElement("div");
  message.innerHTML =
    "Unregistered Smart Object. Press Scan to register a Smart Object";
  message.style.fontSize = "large";
  selector.appendChild(message);
};

let RenderSmartObjectInvalid = function (selector, soData, callbacksMap) {
  // render message for invalid smart object
  // filtered scan
  // TODO
};

let RenderSmartObjectDispatchFunc = {
  Registered: RenderSmartObjectRegistered,
  Unregistered: RenderSmartObjectUnregistered,
  Invalid: RenderSmartObjectInvalid,
};

export function RenderSmartObject(selector, soData, callbacksMap) {
  RenderSmartObjectDispatchFunc[soData.editorData.details.state](
    selector,
    soData,
    callbacksMap
  );
}

// Smart Group Renderer
let RenderSmartGroupProperty = function (selector, property, alias, callbacks) {
  let propertyRow = CreateDOMElement("div", {
    classList: ["row", "align-items-center", "resource-property"],
  });
  selector.appendChild(propertyRow);

  let propertyNameCol = CreateDOMElement("div", {
    classList: ["col-sm-9", "property-title", "text-truncate"],
    innerHtml: property.name,
  });
  propertyRow.appendChild(propertyNameCol);

  let propertyName = CreateDOMElement("div", { classList: ["text-truncate"] });
  propertyName.setAttribute("data-toggle", "tooltip");
  propertyName.setAttribute("data-placement", "bottom");
  propertyName.setAttribute("title", property.name);
  propertyNameCol.appendChild(propertyName);

  let propertyAliasOuterDiv = CreateDOMElement("div");
  propertyAliasOuterDiv.style.fontSize = "small";
  propertyNameCol.appendChild(propertyAliasOuterDiv);

  let propertyAliasHeader = CreateDOMElement("span", { innerHtml: "alias: " });
  propertyAliasOuterDiv.appendChild(propertyAliasHeader);

  let propertyAliasValue = CreateDOMElement("span", { innerHtml: alias });
  propertyAliasValue.style.fontStyle = "italic";
  propertyAliasOuterDiv.appendChild(propertyAliasValue);

  let propertyActiveCol = CreateDOMElement("div", { classList: ["col-sm-1"] });
  propertyRow.appendChild(propertyActiveCol);

  let propertyActiveIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-power-off", "fa-lg"],
  });
  propertyActiveIcon.addEventListener("click", () => {
    callbacks.onEditPropertyActive(property);
  });
  propertyActiveIcon.style.color = "lightgreen";
  propertyActiveCol.appendChild(propertyActiveIcon);

  let propertyEditCol = CreateDOMElement("div", { classList: ["col-sm-1"] });
  propertyEditCol.style.paddingRight = ".5rem";
  propertyRow.appendChild(propertyEditCol);

  let propertyEditIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-edit", "fa-lg"],
  });
  propertyEditIcon.addEventListener("click", () => {
    callbacks.onEditPropertyAlias(property);
  });
  propertyEditCol.appendChild(propertyEditIcon);
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
  smartObjectIcon.addEventListener("click", () => {
    onDeleteSmartObject(smartObject);
  });
  smartObjectIconSpan.appendChild(smartObjectIcon);
};

export function RenderSmartGroup(selector, soData, callbacksMap) {
  let cardDiv = CreateDOMElement("div", {
    classList: ["card", "text-left"],
    id: soData.editorData.id,
  });
  cardDiv.style.width = "33rem";
  cardDiv.style.maxHeight = "45rem";
  selector.appendChild(cardDiv);

  // Card Header
  let cardHeaderDiv = CreateDOMElement("div", { classList: ["card-header"] });
  cardDiv.appendChild(cardHeaderDiv);

  let colHeaderDiv = CreateDOMElement("div", { classList: ["col"] });
  colHeaderDiv.style.display = "inline-flex";
  cardHeaderDiv.appendChild(colHeaderDiv);

  let groupIconSpan = CreateDOMElement("span");
  colHeaderDiv.appendChild(groupIconSpan);

  let groupIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-layer-group", "fa-lg"],
  });
  groupIconSpan.appendChild(groupIcon);

  let resourceHeader = CreateDOMElement("span", { innerHtml: soData.name });
  resourceHeader.style.fontSize = "large";
  resourceHeader.style.marginLeft = ".4rem";
  colHeaderDiv.appendChild(resourceHeader);

  // Render image
  if (soData.img) {
    let resourceImg = CreateDOMElement("img", { classList: ["resource-img"] });
    resourceImg.setAttribute("src", soData.img);
    resourceImg.style.width = "24px";
    resourceImg.style.height = "24px";
    // append
    colHeaderDiv.appendChild(resourceImg);
  }

  // DropDown Menu
  let colMenuDiv = CreateDOMElement("div", { classList: ["col"] });
  colMenuDiv.style.marginLeft = "2rem";
  cardHeaderDiv.appendChild(colMenuDiv);

  let dropDownImg = CreateDOMElement("i", {
    classList: [
      "dropdown-toggle",
      "float-right",
      "resource-menu",
      "fas",
      "fa-ellipsis-v",
    ],
    id: soData.editorData.id + "-menu",
  });
  dropDownImg.setAttribute("data-toggle", "dropdown");
  dropDownImg.setAttribute("aria-haspopup", "true");
  dropDownImg.setAttribute("aria-expanded", "false");
  colMenuDiv.appendChild(dropDownImg);

  let dropDownMenu = CreateDOMElement("div", { classList: ["dropdown-menu"] });
  dropDownMenu.setAttribute("aria-labelledby", soData.editorData.id + "-menu");
  colMenuDiv.appendChild(dropDownMenu);

  let editSelect = CreateDOMElement("a", {
    classList: ["dropdown-item"],
    id: soData.editorData.id + "-edit",
    innerHtml: "Edit",
  });
  editSelect.addEventListener("click", callbacksMap.options.Edit);
  dropDownMenu.appendChild(editSelect);

  let deleteSelect = CreateDOMElement("a", {
    classList: ["dropdown-item"],
    id: soData.editorData.id + "-delete",
    innerHtml: "Delete",
  });
  deleteSelect.addEventListener("click", callbacksMap.options.Delete);
  dropDownMenu.appendChild(deleteSelect);

  // Card Body
  let cardBodyDiv = CreateDOMElement("div", {
    classList: ["card-body"],
    id: soData.editorData.id + "-resource-body",
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
      "Properties (" + soData.editorData.details.properties.length + ")",
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

  _.forEach(soData.editorData.details.properties, (property) => {
    RenderSmartGroupProperty(
      propertiesContainer,
      property,
      soData.editorData.details.mapPropsAlias[property.name],
      {
        onEditPropertyAlias: callbacksMap.onEditPropertyAlias,
        onEditPropertyActive: callbacksMap.onEditPropertyActive,
      }
    );
  });

  let resetRow = CreateDOMElement("div", { classList: ["row"] });
  resetRow.style.marginTop = ".5rem";
  cardBodyDiv.appendChild(resetRow);

  let resetCol = CreateDOMElement("div", { classList: ["col-sm"] });
  resetRow.appendChild(resetCol);

  let resetButton = CreateDOMElement("button", {
    classList: ["btn", "btn-outline-secondary"],
    innerHtml: "Reset",
  });
  resetButton.addEventListener("click", () => {
    callbacksMap.onReset(soData.editorData.details.properties);
  });
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

  _.forEach(soData.editorData.details.smartObjects, (smartObject) => {
    RenderSmartObjectofGroup(
      smartObjectsCol,
      smartObject,
      callbacksMap.onDeleteSmartObject
    );
  });

  let deleteGroupRow = CreateDOMElement("div", { classList: ["row"] });
  deleteGroupRow.style.marginTop = "1rem";
  cardBodyDiv.appendChild(deleteGroupRow);

  let deleteGroupCol = CreateDOMElement("div", { classList: ["col-sm"] });
  deleteGroupRow.appendChild(deleteGroupCol);

  let deleteGroupButton = CreateDOMElement("button", {
    classList: ["btn", "btn-danger"],
    innerHtml: "Delete Group",
  });
  deleteGroupButton.addEventListener("click", callbacksMap.options.Delete);
  deleteGroupButton.style.cssFloat = "right";
  deleteGroupCol.appendChild(deleteGroupButton);
}
