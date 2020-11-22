import {
  RenderSmartObject,
  RenderSmartGroup,
  CreateAndRenderSelectGroupsModal,
} from "./sovplelem-view";

export const VPLElemNames = Object.freeze({
  SMART_OBJECT: "smart-object",
  SMART_GROUP: "smart-group",
});

export const SignalsPrefix = Object.freeze({
  CREATE: "create-",
  DELETE: "delete-",
  RENAME: "rename-",
});

export const SmartObjectState = Object.freeze({
  REGISTERED: "Registered",
  UNREGISTERED: "Unregistered",
  INVALID: "Invalid",
});

const InstStateEnum = Object.freeze({
  INIT: 0,
  OPEN: 1,
  CLOSE: 2,
});

const Privillege = Object.freeze({
  READ_ONLY: "READ_ONLY",
  EDITING: "EDITING",
});

var SOVPLEditorComponent = null;

export function ProjectElementActionsHandling (action, pelem, onSuccess) {
  SOVPLEditorComponent.onProjectElementActionsHandling(
    action,
    pelem,
    onSuccess
  );
}

export class SOVPLElemInstance {
  constructor(
    parent,
    elemData, // { name, color, img, editorData: { editorId, type, details } }
    pitem,
    selector,
    privillege,
    config
  ) {
    this.parent = SOVPLEditorComponent = parent;
    this.pitem = pitem;
    this.selector = selector;
    this.id = elemData.editorData.editorId;
    this.elemData = elemData;
    this.privillege = privillege;
    this.config = config;

    this.state = InstStateEnum.INIT;

    switch (elemData.editorData.type) {
      case VPLElemNames.SMART_OBJECT:
        this.fixInitMapPropsAndGroupsForObject();
        break;
      case VPLElemNames.SMART_GROUP:
        this.fixInitMapPropsAndSmartObjectsForGroups();
        break;
      default:
        throw new Error("not existing type in SO EDITOR");
    }
  }

  get data() {
    return this.elemData;
  }

  // open instance view of the element

  open() {
    if (this.state === InstStateEnum.OPEN) {
      return;
    }

    this.render();
    this.state = InstStateEnum.OPEN;
  }

  close() {
    this.state = InstStateEnum.CLOSE;
  }

  delete() {}

  // user functionality

  fixInitMapPropsAndGroupsForObject() {
    this.elemData.editorData.details.mapPropsAlias =
      this.elemData.editorData.details.mapPropsAlias || {};
    this.elemData.editorData.details.mapPropsProgrammingActive =
      this.elemData.editorData.details.mapPropsProgrammingActive || {};
    this.elemData.editorData.details.groups =
      this.elemData.editorData.details.groups || [];
  }

  fixInitMapPropsAndSmartObjectsForGroups() {
    this.elemData.editorData.details.mapPropsAlias =
      this.elemData.editorData.details.mapPropsAlias || {};
    this.elemData.editorData.details.mapPropsActive =
      this.elemData.editorData.details.mapPropsActive || {};
    this.elemData.editorData.details.smartObjects =
      this.elemData.editorData.details.smartObjects || [];
  }

  updateRegisteredDevices() {
    let projectComponentData = this.parent.getProjectComponentData(
      this.elemData.editorData.projectID
    );
    projectComponentData.registeredDevices =
      projectComponentData.registeredDevices || [];
    projectComponentData.registeredDevices.push({
      id: this.elemData.editorData.details.resourceID,
    });

    this.parent.saveProjectComponentData(
      this.elemData.editorData.projectID,
      projectComponentData
    );
  }

  onCompletingSORegistration(callback) {
    this.render();
    this.updateRegisteredDevices();
    this.parent.saveElement(this);
    callback();
  }

  onApplySelectGroupsForRegistration(groups, listUpdatedAliases, callback) {
    this.elemData.editorData.details.groups = groups;
    listUpdatedAliases.forEach((aliasElem) => {
      this.elemData.editorData.details.mapPropsAlias[aliasElem.old] =
        aliasElem.new;
    });

    this.onCompletingSORegistration(callback);
  }

  // --- Start SmartObject Actions ---
  onSORegister(props, resourceID) {
    this.elemData.editorData.details.state = SmartObjectState.REGISTERED;
    this.elemData.editorData.details.properties = props;
    this.elemData.editorData.details.resourceID = resourceID;

    this.fixInitMapPropsAndGroupsForObject();
    props.forEach((prop) => {
      this.elemData.editorData.details.mapPropsAlias[prop.name] = prop.name;
      this.elemData.editorData.details.mapPropsProgrammingActive[
        prop.name
      ] = true;
    });

    // post parent
    this.parent.registerSmartObject(this, (groups, onCompletion) => {
      // pop up to select groups
      CreateAndRenderSelectGroupsModal(
        this,
        groups,
        (groups, listUpdatedAliases) =>
          this.onApplySelectGroupsForRegistration(
            groups,
            listUpdatedAliases,
            onCompletion
          ),
        () => this.onCompletingSORegistration(onCompletion)
      );
    });
  }

  onSOEditPropAlias(prop) {
    this.elemData.editorData.details.mapPropsAlias[prop.name] = prop.alias;
    this.parent.updateSmartObjectPropAlias(this);
  }

  onSOEditPropProgrammingActive(prop) {
    this.elemData.editorData.details.mapPropsProgrammingActive[prop.name] =
      prop.active;
    this.parent.updateSmartObjectPropProgrammingActive(this);
  }

  // group: {properties: properties, soDataID: id, soName: name}
  onSOCreateSmartGroup(group) {
    // initialize group
    group.elemData = { editorData: { details: {} } };
    group.elemData.editorData.details = {};
    group.elemData.editorData.details.properties = group.properties;
    group.elemData.editorData.details.smartObjects = [
      { id: group.soDataID, name: group.soName },
    ];
    group.elemData.editorData.details.mapPropsAlias = {};
    group.elemData.editorData.details.mapPropsActive = {};
    for (let property of group.properties) {
      let propName = property.name;
      group.elemData.editorData.details.mapPropsAlias[propName] = propName;
      group.elemData.editorData.details.mapPropsActive[propName] = true;
    }

    this.parent.createSmartGroup(
      group.elemData.editorData.details,
      this.elemData.editorData.projectID,
      (pItem) => {
        const key = Object.keys(pItem._editorsData.items)[0];
        const name = pItem._editorsData.items[key].title;
        //add group to smart object
        this.elemData.editorData.details.groups.push({
          id: pItem.systemId,
          name: name,
        });
      }
    );

    delete group.properties;
    delete group.soDataID;
    delete group.soName;
  }

  onSOClickSmartGroup(groupID) {
    let index = this.elemData.editorData.details.groups.findIndex(
      (x) => x.id === groupID
    );
    if (index < 0) {
      throw new Error("Not found group name");
    }
    this.parent.openSmartElement(groupID);
  }

  onSODeleteSmartGroup(groupID) {
    let index = this.elemData.editorData.details.groups.findIndex(
      (x) => x.id === groupID
    );
    if (index < 0) {
      throw new Error("Not found group name");
    }

    this.elemData.editorData.details.groups.splice(index, 1);

    // update data for the smart group
    let projectElement = this.parent.getSmartElement(groupID);

    let firstItem = Object.keys(projectElement._editorsData.items)[0];
    index = projectElement._editorsData.items[
      firstItem
    ].details.smartObjects.findIndex(
      (x) =>
        x.id ===
        this.elemData.editorData.systemID.split("SmartObjectVPLEditor_")[1]
    );
    projectElement._editorsData.items[firstItem].details.smartObjects.splice(
      index,
      1
    );

    this.parent.saveElement(this);
    this.render();
  }
  // --- End SmartObject Actions ---

  // --- Start SmartGroup Actions ---
  onSGEditPropAlias(prop) {
    this.elemData.editorData.details.mapPropsAlias[prop.name] = prop.alias;
    this.parent.updateSmartGroupPropAlias(this);
  }

  onSGEditPropActive(prop) {
    this.elemData.editorData.details.mapPropsActive[prop.name] = prop.active;
    this.parent.updateSmartGroupPropActive(this);
  }

  onSGReset() {
    let mapActive = this.elemData.editorData.details.mapPropsActive;
    for (prop of Object.keys(mapActive)) {
      mapActive[prop] = true;
    }
  }

  onSGClickSmartObject(smartObjectID) {
    let index = this.elemData.editorData.details.smartObjects.findIndex(
      (x) => x.id === smartObjectID
    );
    if (index < 0) {
      throw new Error("Not found object id");
    }
    this.parent.openSmartElement(smartObjectID);
  }

  onSGDeleteSmartObject(smartObjectID) {
    let index = this.elemData.editorData.details.smartObjects.findIndex(
      (x) => x.id === smartObjectID
    );
    if (index < 0) {
      throw new Error("Not found smart object id");
    }
    this.elemData.editorData.details.smartObjects.splice(index, 1);

    // update data for the smart object
    let projectElement = this.parent.getSmartElement(smartObjectID);

    let firstItem = Object.keys(projectElement._editorsData.items)[0];
    index = projectElement._editorsData.items[
      firstItem
    ].details.groups.findIndex(
      (x) =>
        x.id ===
        this.elemData.editorData.systemID.split("SmartObjectVPLEditor_")[1]
    );

    projectElement._editorsData.items[firstItem].details.groups.splice(
      index,
      1
    );

    this.parent.saveElement(this);
    this.render();
  }
  // --- End SmartGroup Actions ---

  render() {
    // clear selector
    document.getElementById(this.selector).innerHTML = "";
    let domSel = document.getElementById(this.selector);
    let componentData = this.parent.getProjectComponentData(
      this.elemData.editorData.projectID
    );
    switch (this.elemData.editorData.type) {
      case VPLElemNames.SMART_OBJECT:
        RenderSmartObject(domSel, this.elemData, componentData, {
          onRegister: (props, resourceID) =>
            this.onSORegister(props, resourceID),
          onEditPropertyAlias: (prop) => this.onSOEditPropAlias(prop),
          onEditPropertyProgrammingActive: (prop) =>
            this.onSOEditPropProgrammingActive(prop),
          onCreateSmartGroup: (group) => this.onSOCreateSmartGroup(group),
          onClickSmartGroup: (groupID) => this.onSOClickSmartGroup(groupID),
          onDeleteSmartGroup: (groupID) => this.onSODeleteSmartGroup(groupID),
          options: {
            Edit: () => {
              alert("not connected yet.");
            },
            Delete: () => {
              alert("not connected yet.");
            },
          },
        });
        break;
      case VPLElemNames.SMART_GROUP:
        RenderSmartGroup(domSel, this.elemData, componentData, {
          onEditPropertyAlias: (prop) => this.onSGEditPropAlias(prop),
          onEditPropertyActive: (prop) => this.onSGEditPropActive(prop),
          onReset: (props) => this.onSGReset(props),
          onClickSmartObject: (objectId) => this.onSGClickSmartObject(objectId),
          onDeleteSmartObject: (objectId) =>
            this.onSGDeleteSmartObject(objectId),
          options: {
            Edit: () => {
              alert("not connected yet.");
            },
            Delete: () => {
              alert("not connected yet.");
            },
          },
        });
        break;
      default:
        throw new Error("not existing type in SO EDITOR");
    }
  }

  updatePItemData(name, img, color) {
    this.elemData.name = name;
    this.elemData.img = img;
    this.elemData.color = color;
    this.render(this.selector, this.elemData);
  }

  sync(data, pitem) {
    this.render(this.selector, this.elemData);
  }
}
