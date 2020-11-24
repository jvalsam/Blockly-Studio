import * as soUIGenerator from "../../../../../../domains-libs/IoT/AutoIoTGen/iot-interfaces/dist/iot-ui";

// functionality
import { RenderSmartObject } from "./sovplelem-view";

import { RequestScanResources } from "../request";

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

let CreateModal = function (dom, idPrefix) {
  let modal = CreateDOMElement("div", {
    classList: ["modal", "fade"],
    id: idPrefix + "-modal",
  });
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "true");
  dom.appendChild(modal);

  let modalDialog = CreateDOMElement("div", {
    classList: ["modal-dialog", "modal-lg"],
  });
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
    id: idPrefix + "-modal-title",
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
    id: idPrefix + "-modal-body",
  });
  modalContent.appendChild(modalBody);

  let modalFooter = CreateDOMElement("div", { classList: ["modal-footer"] });
  modalContent.appendChild(modalFooter);

  let cancelButton = CreateDOMElement("button", {
    classList: ["btn", "btn-secondary"],
    id: idPrefix + "-modal-cancel-button",
    innerHtml: "Cancel",
  });
  cancelButton.setAttribute("type", "button");
  cancelButton.setAttribute("data-dismiss", "modal");
  modalFooter.appendChild(cancelButton);

  let confirmButton = CreateDOMElement("div", {
    classList: ["btn", "btn-primary"],
    id: idPrefix + "-modal-confirm-button",
    innerHtml: "Confirm",
  });
  confirmButton.setAttribute("type", "button");
  modalFooter.appendChild(confirmButton);
};

let ClearModal = function (idPrefix) {
  idPrefix + "-modal-title";
  idPrefix + "-modal-body";
  idPrefix + "-modal-cancel-button";
  idPrefix + "-modal-confirm-button";

  document.getElementById(idPrefix + "-modal-title").innerHTML = "";
  document.getElementById(idPrefix + "-modal-body").innerHTML = "";
  document.getElementById(idPrefix + "-modal-cancel-button").innerHTML =
    "Cancel";
  document.getElementById(idPrefix + "-modal-confirm-button").innerHTML =
    "Confirm";
};

/* Start functions for selection group modal */
let CheckAndGetUnmatchedProperties = function (
  smartObjectDetails,
  smartGrouptDetails
) {
  // we dont need to return as unmatched sg and so with different length
  if (
    smartObjectDetails.properties.length !==
    smartGrouptDetails.properties.length
  )
    return {
      result: "unmatchedInLength",
      so: [],
      sg: [],
    };

  let sgMatchedProperties = [];
  let soUnmatchedNames = [];

  let isMatched = false;

  for (const smartObjectProperty of smartObjectDetails.properties) {
    isMatched = false;
    for (const smartGroupProperty of smartGrouptDetails.properties) {
      if (
        // (name === name || alias)
        smartObjectProperty.name === smartGroupProperty.name ||
        smartObjectProperty.name ===
          smartGrouptDetails.mapPropsAlias[smartGroupProperty.name] ||
        // (alias === name || alias)
        smartObjectDetails.mapPropsAlias[smartObjectProperty.name] ===
          smartGroupProperty.name ||
        smartObjectDetails.mapPropsAlias[smartObjectProperty.name] ===
          smartGrouptDetails.mapPropsAlias[smartGroupProperty.name]
      ) {
        isMatched = true;
        // push matched properties
        sgMatchedProperties.push(smartGroupProperty.name);
      }
    }
    if (!isMatched) soUnmatchedNames.push(smartObjectProperty.name);
  }

  if (soUnmatchedNames.length === 0) {
    return {
      result: "matched",
      so: [],
      sg: [],
    };
  }

  // collect the unmatched properties for group and smart object
  // save unmatchedNames of sg
  let sgUnmatchedNames = smartGrouptDetails.properties
    .map((prop) => prop.name)
    .filter((propName) => !sgMatchedProperties.includes(propName));

  let soResult = [],
    sgResult = [],
    tmpObj = {};

  for (let i = 0; i < soUnmatchedNames.length; i++) {
    // so: [ {name: alias} ]
    tmpObj[soUnmatchedNames[i]] =
      smartObjectDetails.mapPropsAlias[soUnmatchedNames[i]];
    soResult.push(tmpObj);
    tmpObj = {};

    // sg: [ {name: alias} ]
    tmpObj[sgUnmatchedNames[i]] =
      smartGrouptDetails.mapPropsAlias[sgUnmatchedNames[i]];
    sgResult.push(tmpObj);
    tmpObj = {};
  }

  return {
    result: "unmatched",
    so: soResult,
    sg: sgResult,
  };
};

let CompareGroupsWithSO = function (smartObjectElemData, groupsVPLElements) {
  let smartObjectDetails = smartObjectElemData.editorData.details;
  let result = { matched: [], unmatched: [], unmatchedInLength: [] };
  let soName = smartObjectElemData.name;

  for (const group of groupsVPLElements) {
    let firstItem = Object.keys(group._editorsData.items)[0];
    let smartGroupName = group._editorsData.items[firstItem].title;
    let smartGroupDetails = group._editorsData.items[firstItem].details;
    let smartGroupID = group._editorsData.items[firstItem].systemID.split(
      "SmartObjectVPLEditor_"
    )[1];

    let checkUnmatchedProperties = CheckAndGetUnmatchedProperties(
      smartObjectDetails,
      smartGroupDetails
    );

    let tmpObject = {};
    tmpObject.so = checkUnmatchedProperties.so;
    tmpObject.sg = checkUnmatchedProperties.sg;
    tmpObject.result = checkUnmatchedProperties.result;
    tmpObject._sgName = smartGroupName;
    tmpObject._sgID = smartGroupID;
    tmpObject._soName = soName;

    result[tmpObject.result].push(tmpObject);
  }
  return result;
};

let CreateOptionsForSelectionsOfSGProps = function (selectionDom, smartGroup) {
  for (let i = 0; i < smartGroup.length; i++) {
    let option = CreateDOMElement("option", {
      innerHtml: Object.keys(smartGroup[i])[0],
    });
    option.value = Object.keys(smartGroup[i])[0];
    selectionDom.appendChild(option);
  }
};

let CreateDifferencesTableInGroupSelection = function (
  domSel,
  elemName,
  props,
  isSO,
  sgProps,
  updatedAliases
) {
  let tableDifferences = CreateDOMElement("table", {
    classList: [
      "table",
      "table-striped",
      "table-bordered",
      "select-groups-differences-table",
    ],
  });
  domSel.appendChild(tableDifferences);

  if (isSO) {
    let firstTHead = CreateDOMElement("thead");
    tableDifferences.appendChild(firstTHead);

    let trHeader = CreateDOMElement("tr");
    firstTHead.appendChild(trHeader);

    let thSOName = CreateDOMElement("th", { innerHtml: elemName });
    thSOName.setAttribute("colspan", "2");
    thSOName.setAttribute("scope", "colgroup");
    trHeader.appendChild(thSOName);
  }

  let secondTHead = CreateDOMElement("thead");
  tableDifferences.appendChild(secondTHead);

  let trSecondHeader = CreateDOMElement("tr");
  secondTHead.appendChild(trSecondHeader);

  let thSOPropNameHeader = CreateDOMElement("th", { innerHtml: "Property" });
  thSOPropNameHeader.setAttribute("scope", "col");
  trSecondHeader.appendChild(thSOPropNameHeader);

  let thSOPropAliasHeader = CreateDOMElement("th");
  thSOPropAliasHeader.setAttribute("scope", "col");
  trSecondHeader.appendChild(thSOPropAliasHeader);

  let spanAlias = CreateDOMElement("span", { innerHtml: "Alias" });
  thSOPropAliasHeader.appendChild(spanAlias);

  if (isSO) {
    let spanMatchWith = CreateDOMElement("span", {
      innerHtml: "(select group property)",
    });
    spanMatchWith.style.marginLeft = ".3rem";
    spanMatchWith.style.fontStyle = "italic";
    thSOPropAliasHeader.appendChild(spanMatchWith);
  }

  let tBody = CreateDOMElement("tbody");
  tableDifferences.appendChild(tBody);

  for (let i = 0; i < props.length; i++) {
    let trValues = CreateDOMElement("tr");
    tBody.appendChild(trValues);

    // so name and alias
    let soPropName = Object.keys(props[i])[0];
    let tdSOName = CreateDOMElement("td", { innerHtml: soPropName });
    trValues.appendChild(tdSOName);

    if (isSO) {
      let tdSOAlias = CreateDOMElement("td");
      trValues.appendChild(tdSOAlias);

      let selectForAlias = CreateDOMElement("select", {
        classList: ["custom-select", "mr-sm-2"],
        // id: "select-alias-" + soPropName.replace(/\s/g, ""),
      });
      selectForAlias.onchange = () => {
        let index = updatedAliases.findIndex(
          (x) => x.old === props[i][Object.keys(props[i])[0]]
        );
        updatedAliases[index].new = selectForAlias.value;
      };
      selectForAlias.style.width = "auto";
      tdSOAlias.appendChild(selectForAlias);

      // default option with value the current alias of smart object
      let option = CreateDOMElement("option", {
        innerHtml: "select",
      });
      option.disabled = true;
      option.setAttribute("selected", "selected");
      option.value = props[i][Object.keys(props[i])[0]];
      selectForAlias.appendChild(option);

      CreateOptionsForSelectionsOfSGProps(selectForAlias, sgProps);
    } else {
      let sgPropAlias = props[i][Object.keys(props[i])[0]];
      let tdSGAlias = CreateDOMElement("td", { innerHtml: sgPropAlias });
      trValues.appendChild(tdSGAlias);
    }
  }
};

export function CreateAndRenderSelectGroupsModal(
  sovplelemInst,
  groupsVPLElements,
  onSuccess, // (groups: Array<String>, updatedAliases: Array<{old: string, new: string}>)
  onSkip
) {
  // Create Modal
  CreateModal(
    document.getElementsByClassName("modal-platform-container")[0],
    "select-group"
  );

  RenderSelectGroupsModal(
    document.getElementById("select-group-modal"),
    sovplelemInst,
    groupsVPLElements,
    onSuccess // (groups: Array<String>, updatedAliases: Array<{old: string, new: string}>)
  );

  // Destroy on close
  $("#select-group-modal").on("hidden.bs.modal", function () {
    document.getElementsByClassName("modal-platform-container")[0].innerHTML =
      "";
    onSkip();
  });

  $("#select-group-modal").modal("show");
}

function RenderSelectGroupsModal(
  domSelector,
  sovplelemInst,
  groupsVPLElements,
  onSuccess // (groups: Array<String>, updatedAliases: Array<{old: string, new: string}>)
) {
  let updatedAliases = [];

  // clear Modal
  ClearModal("select-group");

  // fill modal
  document.getElementById("select-group-modal-title").innerHTML =
    "Select Group(s) for " + sovplelemInst.elemData.name;
  let modalBody = document.getElementById("select-group-modal-body");
  let properties = sovplelemInst.elemData.editorData.details.properties;
  let mapPropsAlias = sovplelemInst.elemData.editorData.details.mapPropsAlias;

  let soPropertiesDiv = CreateDOMElement("div", {
    classList: ["pb-3"],
  });
  // soPropertiesDiv.style.paddingBottom = ".5rem";
  modalBody.appendChild(soPropertiesDiv);

  let foldPropertiesSpanForIcon = CreateDOMElement("span");
  foldPropertiesSpanForIcon.style.cursor = "pointer";
  foldPropertiesSpanForIcon.onclick = () => {
    if (
      document
        .getElementById("fold-so-properties-icon")
        .classList.contains("fa-caret-down")
    ) {
      // change icon
      foldPropertiesIcon.classList.remove("fa-caret-down");
      foldPropertiesIcon.classList.add("fa-caret-right");
      // remove padding bottom from soPropertiesDiv
      soPropertiesDiv.classList.remove("pb-3");
      // hide properties' area
      propertiesArea.style.display = "none";
    } else {
      // change icon
      foldPropertiesIcon.classList.remove("fa-caret-right");
      foldPropertiesIcon.classList.add("fa-caret-down");
      // add padding bottom to soPropertiesDiv
      soPropertiesDiv.classList.add("pb-3");
      // show properties' area
      propertiesArea.style.display = "block";
    }
  };
  soPropertiesDiv.appendChild(foldPropertiesSpanForIcon);

  let foldPropertiesIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-caret-down", "fa-lg"],
    id: "fold-so-properties-icon",
  });
  foldPropertiesSpanForIcon.appendChild(foldPropertiesIcon);

  let soPropertiesHeader = CreateDOMElement("span", {
    classList: ["h5", "ml-2"],
    innerHtml: "Smart Object Properties",
  });
  soPropertiesDiv.appendChild(soPropertiesHeader);

  // Property Area folded
  let propertiesArea = CreateDOMElement("div");
  propertiesArea.style.maxHeight = "15rem";
  propertiesArea.style.overflowY = "auto";
  // propertiesArea.style.display = "none";
  modalBody.appendChild(propertiesArea);

  // Create table for properties
  let table = CreateDOMElement("table", {
    classList: [
      "table",
      "table-striped",
      "table-bordered",
      "selection-group-so-properties-table",
    ],
  });
  propertiesArea.appendChild(table);

  let tHead = CreateDOMElement("tHead");
  table.appendChild(tHead);

  let trHead = CreateDOMElement("tr");
  tHead.appendChild(trHead);

  let thName = CreateDOMElement("th", {
    innerHtml: "Property",
  });
  thName.setAttribute("scope", "col");
  trHead.appendChild(thName);

  let thAlias = CreateDOMElement("th", {
    innerHtml: "Alias",
  });
  thAlias.setAttribute("scope", "col");
  trHead.appendChild(thAlias);

  let tBody = CreateDOMElement("tbody");
  table.appendChild(tBody);

  // build properties
  for (const property of properties) {
    let trProp = CreateDOMElement("tr");
    tBody.appendChild(trProp);

    let tdPropName = CreateDOMElement("td", {
      innerHtml: property.name,
    });
    trProp.appendChild(tdPropName);

    let tdPropAlias = CreateDOMElement("td", {
      innerHtml: mapPropsAlias[property.name],
    });
    trProp.appendChild(tdPropAlias);

    // init updated alliases for smart object
    updatedAliases.push({
      old: mapPropsAlias[property.name],
      new: mapPropsAlias[property.name],
      property: property.name,
    });
  }

  let hr = CreateDOMElement("hr");
  modalBody.appendChild(hr);

  /*  Start Groups that matched with so */
  let comparedArray = CompareGroupsWithSO(
    sovplelemInst.elemData,
    groupsVPLElements
  );

  let groupsMatchHeaderDiv = CreateDOMElement("div", { classList: ["pb-3"] });
  modalBody.appendChild(groupsMatchHeaderDiv);

  let groupsMatchHeader = CreateDOMElement("span", {
    classList: ["h5", "pb-3"],
    innerHtml: "Groups that match with your device",
  });
  groupsMatchHeaderDiv.appendChild(groupsMatchHeader);

  let groupsMatchArea = CreateDOMElement("div");
  modalBody.appendChild(groupsMatchArea);

  // warning that there are not groups that match
  if (comparedArray.matched.length === 0) {
    let noGroupsMatched = CreateDOMElement("div", {
      innerHtml: "There are no groups which are matched with the smart object",
    });
    noGroupsMatched.style.fontStyle = "italic";
    groupsMatchArea.appendChild(noGroupsMatched);
  } else {
    let selectAllGroupsDiv = CreateDOMElement("span");
    selectAllGroupsDiv.style.marginLeft = "12.1rem";
    groupsMatchHeaderDiv.appendChild(selectAllGroupsDiv);

    let selectAllGroups = CreateDOMElement("input", {
      id: "select-all-groups",
    });
    selectAllGroups.setAttribute("type", "checkbox");
    selectAllGroups.onchange = () => {
      for (const matchedPair of comparedArray.matched) {
        document.getElementById(
          "mathced-group-" + matchedPair._sgName.replace(/\s/g, "")
        ).checked = selectAllGroups.checked;
      }
    };
    selectAllGroupsDiv.appendChild(selectAllGroups);

    let labelSelectAllGroups = CreateDOMElement("label", {
      innerHtml: "Select all",
    });
    labelSelectAllGroups.setAttribute("for", "select-all-groups");
    labelSelectAllGroups.style.marginLeft = ".2rem";
    selectAllGroupsDiv.appendChild(labelSelectAllGroups);

    let matchedGroupRow = CreateDOMElement("div", { classList: ["row"] });
    groupsMatchArea.appendChild(matchedGroupRow);

    for (const matchedPair of comparedArray.matched) {
      let matchedGroupCol = CreateDOMElement("div", {
        classList: ["col-sm-4"],
      });
      matchedGroupRow.appendChild(matchedGroupCol);

      let checkboxGroup = CreateDOMElement("input", {
        id: "mathced-group-" + matchedPair._sgName.replace(/\s/g, ""),
      });
      checkboxGroup.setAttribute("type", "checkbox");
      matchedGroupCol.appendChild(checkboxGroup);

      let labelForGroup = CreateDOMElement("label", {
        innerHtml: matchedPair._sgName,
      });
      labelForGroup.style.marginLeft = ".2rem";
      labelForGroup.setAttribute("for", checkboxGroup.id);

      matchedGroupCol.appendChild(labelForGroup);
    }
  }

  hr = CreateDOMElement("hr");
  modalBody.appendChild(hr);
  /*  End Groups that matched with so */

  /* Start Groups that dont match with so */
  let groupsNotMatchHeader = CreateDOMElement("div", {
    classList: ["h5", "pb-3"],
    innerHtml: "Groups that do not match with your device",
  });
  modalBody.appendChild(groupsNotMatchHeader);

  let groupsNotMatchArea = CreateDOMElement("div");
  modalBody.appendChild(groupsNotMatchArea);

  if (
    comparedArray.unmatched.length === 0 &&
    comparedArray.unmatchedInLength.length === 0
  ) {
    let noGroupsUnMatched = CreateDOMElement("div", {
      innerHtml:
        "There are no groups which are not matched with the smart object",
    });
    noGroupsUnMatched.style.fontStyle = "italic";
    // noGroupsMatched.style.fontSize = "";
    groupsNotMatchArea.appendChild(noGroupsUnMatched);
  } else {
    let unmatchedGroupsRow = CreateDOMElement("div", { classList: ["row"] });
    groupsNotMatchArea.appendChild(unmatchedGroupsRow);

    let unmatchedGroupsCol = CreateDOMElement("div", {
      classList: ["col-3"],
    });
    unmatchedGroupsCol.style.borderRight = "1px solid #8e8c8c";
    unmatchedGroupsRow.appendChild(unmatchedGroupsCol);

    let navDiv = CreateDOMElement("div", {
      classList: ["nav", "flex-column", "nav-pills"],
    });
    navDiv.setAttribute("role", "tablist");
    navDiv.setAttribute("aria-orientation", "vertical");
    unmatchedGroupsCol.appendChild(navDiv);

    let unmatchedGroupsInfoCol = CreateDOMElement("div", {
      classList: ["col"],
    });
    unmatchedGroupsRow.appendChild(unmatchedGroupsInfoCol);
    let unmatchedGroupsInfoContent = CreateDOMElement("div", {
      classList: ["tab-content"],
      id: "v-pills-tabContent",
    });
    unmatchedGroupsInfoCol.appendChild(unmatchedGroupsInfoContent);

    for (let i = 0; i < comparedArray.unmatched.length; ++i) {
      let unmatchedPair = comparedArray.unmatched[i];
      let aNav = CreateDOMElement("a", {
        classList: ["nav-link", "nav-group-selection-list"],
        id: "v-pills-" + unmatchedPair._sgName.replace(/\s/g, "") + "-tab",
        innerHtml: unmatchedPair._sgName,
      });
      aNav.setAttribute("data-toggle", "pill");
      aNav.setAttribute(
        "href",
        "#v-pills-" + unmatchedPair._sgName.replace(/\s/g, "")
      );
      aNav.setAttribute("role", "tab");
      aNav.setAttribute(
        "aria-controls",
        "v-pills-" + unmatchedPair._sgName.replace(/\s/g, "")
      );
      aNav.setAttribute("aria-selected", "true");
      navDiv.appendChild(aNav);

      let tabPane = CreateDOMElement("div", {
        classList: ["tab-pane", "fade"],
        id: "v-pills-" + unmatchedPair._sgName.replace(/\s/g, ""),
      });
      tabPane.setAttribute("role", "tabpanel");
      tabPane.setAttribute(
        "aria-labelledby",
        "v-pills-" + unmatchedPair._sgName.replace(/\s/g, "") + "-tab"
      );
      unmatchedGroupsInfoContent.appendChild(tabPane);

      let tabPaneRow = CreateDOMElement("div", { classList: ["row"] });
      tabPane.appendChild(tabPaneRow);

      let firstTableCol = CreateDOMElement("div", { classList: ["col"] });
      firstTableCol.style.maxWidth = "fit-content";
      tabPaneRow.appendChild(firstTableCol);

      CreateDifferencesTableInGroupSelection(
        firstTableCol,
        unmatchedPair._sgName,
        unmatchedPair.sg,
        false
      );

      let secondTableCol = CreateDOMElement("div", { classList: ["col"] });
      secondTableCol.style.maxWidth = "fit-content";
      tabPaneRow.appendChild(secondTableCol);

      CreateDifferencesTableInGroupSelection(
        secondTableCol,
        unmatchedPair._soName,
        unmatchedPair.so,
        true,
        unmatchedPair.sg,
        updatedAliases
      );

      let matchButton = CreateDOMElement("button", {
        classList: ["btn", "btn-info", "float-right"],
        innerHtml: "Update",
      });
      matchButton.onclick = () => {
        // update mapPropAlias of smartobject to re-render modal
        for (const aliasPair of updatedAliases) {
          sovplelemInst.elemData.editorData.details.mapPropsAlias[
            aliasPair.property
          ] = aliasPair.new;
        }

        // re-render modal
        RenderSelectGroupsModal(
          domSelector,
          sovplelemInst,
          groupsVPLElements,
          onSuccess
        );
      };
      secondTableCol.appendChild(matchButton);

      if (i === 0) {
        aNav.classList.add("active");
        tabPane.classList.add("show");
        tabPane.classList.add("active");
      }
    }

    for (let i = 0; i < comparedArray.unmatchedInLength.length; ++i) {
      let unmatchedPair = comparedArray.unmatchedInLength[i];
      let aNav = CreateDOMElement("a", {
        classList: ["nav-link", "nav-group-selection-list"],
        id: "v-pills-" + unmatchedPair._sgName.replace(/\s/g, "") + "-tab",
        innerHtml: unmatchedPair._sgName,
      });
      aNav.style.color = "rgb(202 202 202)";
      aNav.setAttribute("data-toggle", "pill");
      aNav.setAttribute(
        "href",
        "#v-pills-" + unmatchedPair._sgName.replace(/\s/g, "")
      );
      aNav.setAttribute("role", "tab");
      aNav.setAttribute(
        "aria-controls",
        "v-pills-" + unmatchedPair._sgName.replace(/\s/g, "")
      );
      aNav.setAttribute("aria-selected", "true");
      navDiv.appendChild(aNav);

      let tabPane = CreateDOMElement("div", {
        classList: ["tab-pane", "fade"],
        id: "v-pills-" + unmatchedPair._sgName.replace(/\s/g, ""),
      });
      tabPane.setAttribute("role", "tabpanel");
      tabPane.setAttribute(
        "aria-labelledby",
        "v-pills-" + unmatchedPair._sgName.replace(/\s/g, "") + "-tab"
      );
      unmatchedGroupsInfoContent.appendChild(tabPane);

      let tabPaneContent = CreateDOMElement("div", {
        innerHtml:
          "This group cannot be matched with the smart object because of difference in properties length",
      });
      tabPaneContent.style.fontStyle = "italic";
      tabPane.appendChild(tabPaneContent);

      if (i === 0 && comparedArray.unmatched.length === 0) {
        aNav.classList.add("active");
        tabPane.classList.add("show");
        tabPane.classList.add("active");
      }
    }
  }
  /* End Groups that dont match with so */

  // onclick confirm Button
  document.getElementById("select-group-modal-confirm-button").innerHTML =
    "Apply";
  document.getElementById("select-group-modal-confirm-button").onclick = () => {
    let groups = [];
    if (
      document.getElementById("select-all-groups") &&
      document.getElementById("select-all-groups").checked
    ) {
      for (const matchedGroup of comparedArray.matched) {
        groups.push({ id: matchedGroup._sgID, name: matchedGroup._sgName });
      }
    } else {
      for (const matchedGroup of comparedArray.matched) {
        if (
          document.getElementById(
            "mathced-group-" + matchedGroup._sgName.replace(/\s/g, "")
          ).checked
        ) {
          groups.push({ id: matchedGroup._sgID, name: matchedGroup._sgName });
        }
      }
    }

    onSuccess(groups, updatedAliases);
    document.getElementsByClassName("modal-platform-container")[0].innerHTML =
      "";
    document.getElementsByClassName("modal-backdrop")[0].remove();
  };

  // Update cancel button
  document.getElementById("select-group-modal-cancel-button").innerHTML =
    "Skip";
}
/* End functions for selection group modal */

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
let BuildPropertiesArea = function (dom, smartElem) {
  // Properties
  let propertiesRow = CreateDOMElement("div", { classList: ["row"] });
  propertiesRow.style.marginTop = "2rem";
  dom.appendChild(propertiesRow);

  let propertiesCol = CreateDOMElement("div", { classList: ["col-sm"] });
  propertiesRow.appendChild(propertiesCol);

  let propertiesHeader = CreateDOMElement("span", {
    classList: ["font-weight-bold"],
    innerHtml:
      "Properties (" + smartElem.editorData.details.properties.length + ")",
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
  dom.appendChild(propertiesContainer);

  return propertiesContainer;
};

const bubbleEvents = {};

// detach events for bubbles
let DetachEventsOnBubble = function (smartElementId) {
  document.getElementById("bubble-click-" + smartElementId).onclick = null;
  document.getElementById("bubble-delete-" + smartElementId).onclick = null;
  delete bubbleEvents["bubble-click-" + smartElementId];
  delete bubbleEvents["bubble-delete-" + smartElementId];
};

let BuildBubblesArea = function (dom, htmlForHeading) {
  let smartElemHeaderRow = CreateDOMElement("div", { classList: ["row"] });
  smartElemHeaderRow.style.marginTop = "1rem";
  dom.appendChild(smartElemHeaderRow);

  let smartElemName = CreateDOMElement("div", {
    classList: ["col-sm", "font-weight-bold"],
    innerHtml: htmlForHeading,
  });
  smartElemName.style.fontSize = "large";
  smartElemName.style.marginTop = "auto";
  smartElemName.style.marginBottom = "auto";
  smartElemHeaderRow.appendChild(smartElemName);

  let bubblesDiv = CreateDOMElement("div", { classList: ["bubbles-area"] });
  dom.appendChild(bubblesDiv);

  return bubblesDiv;
};

let RenderBubbles = function (selector, smartElements, onClick, onDelete) {
  if (smartElements.length === 0) {
    let span = CreateDOMElement("div", {
      classList: ["h6"],
      innerHtml: "There are no elements",
    });
    selector.appendChild(span);
    selector.style.textAlign = "center";
    selector.style.height = "4rem";
    span.style.marginTop = "1rem";
  }
  for (const smartElement of smartElements) {
    RenderBubble(selector, smartElement, onClick, onDelete);
  }
};

let RenderBubble = function (
  selector,
  smartElement,
  onClickAtElement,
  onDeleteSmartElement
) {
  let button = CreateDOMElement("span", {
    classList: ["badge", "badge-pill", "badge-secondary", "bubble"],
    id: "bubble-click-" + smartElement.id,
    innerHtml: smartElement.name,
  });
  button.onclick = () => {
    onClickAtElement(smartElement.id);
  };
  bubbleEvents["bubble-click-" + smartElement.id] = "onClick";
  selector.appendChild(button);

  let buttonIconSpan = CreateDOMElement("span", {
    classList: ["times", "delete-bubble"],
    id: "bubble-delete-" + smartElement.id,
  });
  let onDeleteHandler = () => {
    DetachEventsOnBubble(smartElement.id);
    onDeleteSmartElement(smartElement.id);
  };
  buttonIconSpan.onclick = onDeleteHandler;
  bubbleEvents["bubble-delete-" + smartElement.id] = "onDelete";
  selector.appendChild(buttonIconSpan);

  let buttonIcon = CreateDOMElement("i", {
    classList: ["fas", "fa-times-circle"],
  });
  buttonIcon.style.fontSize = "small";
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
  let cardDiv = soUIGenerator.RenderCard({
    selector: selector,
    id: soData.editorData.editorId,
  });

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
  let propertiesContainer = BuildPropertiesArea(cardBodyDiv, soData);

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
  let bubblesDiv = BuildBubblesArea(cardBodyDiv, "Smart Groups");

  RenderBubbles(
    bubblesDiv,
    soData.editorData.details.groups,
    callbacksMap.onClickSmartGroup,
    callbacksMap.onDeleteSmartGroup
  );

  let buttonsRow = CreateDOMElement("div", { classList: ["row"] });
  buttonsRow.style.marginTop = "1.5rem";
  cardBodyDiv.appendChild(buttonsRow);

  let createGroupsButtonCol = CreateDOMElement("div", {
    classList: ["col-sm"],
  });
  createGroupsButtonCol.style.textAlign = "right";
  buttonsRow.appendChild(createGroupsButtonCol);

  let createGroupsButton = CreateDOMElement("button", {
    classList: ["btn", "btn-info"],
    innerHtml: "Create Group",
  });
  createGroupsButtonCol.onclick = () => {
    callbacksMap.onCreateSmartGroup({
      properties: soData.editorData.details.properties,
      soDataID: soData.editorData.systemID.split("SmartObjectVPLEditor_")[1],
      soName: soData.name,
    });
  };
  createGroupsButtonCol.appendChild(createGroupsButton);
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

  let scanButtonRow = document.createElement("div");
  scanButtonRow.classList.add("row");
  scanContainer.appendChild(scanButtonRow);

  let scanButtoncol = document.createElement("div");
  scanButtoncol.classList.add("col");
  scanButtonRow.appendChild(scanButtoncol);

  let resourcesArea = CreateDOMElement("div");
  scanContainer.appendChild(resourcesArea);

  // render message for unregistered smart object
  soUIGenerator.RenderScanButton(
    scanButtoncol,
    RequestScanResources,
    (resources) => {
      if (!projectComponentsData.registeredDevices) {
        projectComponentsData.registeredDevices = [];
      }
      // Clear col
      resourcesArea.innerHTML = "";
      soUIGenerator.RenderScanList(
        resourcesArea,
        FilterRegisteredDevicesForScan(
          projectComponentsData.registeredDevices,
          resources
        ),
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
        },
        false
      );
    }
  );

  let messageRow = document.createElement("div");
  messageRow.classList.add("row");
  resourcesArea.appendChild(messageRow);

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

// TODO: same code with render smart object need refactor
export function RenderSmartGroup(
  selector,
  sgData,
  projectComponentsData,
  callbacksMap
) {
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
  let propertiesContainer = BuildPropertiesArea(cardBodyDiv, sgData);

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
  let bubblesDiv = BuildBubblesArea(cardBodyDiv, "Smart Objects");
  RenderBubbles(
    bubblesDiv,
    sgData.editorData.details.smartObjects,
    callbacksMap.onClickSmartObject,
    callbacksMap.onDeleteSmartObject
  );
}
