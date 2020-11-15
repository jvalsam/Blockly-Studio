import {
  RenderSmartObject,
  RenderSmartGroup,
  dialogueSelectGroups,
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

export class SOVPLElemInstance {
  constructor(
    parent,
    elemData, // { name, color, img, editorData: { editorId, type, details } }
    pitem,
    selector,
    privillege,
    config
  ) {
    this.parent = parent;
    this.pitem = pitem;
    this.selector = selector;
    this.id = elemData.editorData.editorId;
    this.elemData = elemData;
    this.fixInitMapPropsAndGroups();
    this.privillege = privillege;
    this.config = config;

    this.state = InstStateEnum.INIT;
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

  fixInitMapPropsAndGroups() {
    this.elemData.editorData.details.mapPropsAlias =
      this.elemData.editorData.details.mapPropsAlias || {};
    this.elemData.editorData.details.mapPropsProgrammingActive =
      this.elemData.editorData.details.mapPropsProgrammingActive || {};
    this.elemData.editorData.details.groups =
      this.elemData.editorData.details.groups || [];
  }

  updateRegisteredDevices() {
    let projectComponentData = this.parent.getProjectComponentData(this.elemData.editorData.projectID);
    projectComponentData.registeredDevices = projectComponentData.registeredDevices || [];
    projectComponentData.registeredDevices.push({
      id: this.elemData.editorData.details.resourceID,
    });

    this.parent.saveProjectComponentData(
      this.elemData.editorData.projectID,
      projectComponentData
    );
  }

  onCompletingSORegistration(callback) {
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

    this.fixInitMapPropsAndGroups();
    props.forEach((prop) => {
      this.elemData.editorData.details.mapPropsAlias[prop.name] = prop.name;
      this.elemData.editorData.details.mapPropsProgrammingActive[
        prop.name
      ] = true;
    });

    // post parent
    this.parent.registerSmartObject(this, (groups, onCompletion) => {
      // pop up to select groups
      dialogueSelectGroups(
        this,
        groups,
        (groups, listUpdatedAliases) => this.onApplySelectGroupsForRegistration(
          groups, listUpdatedAliases, onCompletion),
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

  // group: { name, img, color, properties, mapPropsInfo, smartObject }
  onSOCreateSmartGroup(group) {
    console.log(group);
    // init map data of group props
    group.details = {};
    group.details.properties = group.properties;
    group.details.mapPropsAlias = {};
    group.details.mapPropsActive = {};
    for (let propName of Object.keys(group.mapPropsInfo)) {
      let prop = group.mapPropsInfo[propName];
      group.details.mapPropsAlias[propName] = prop.alias;
      group.details.mapPropsActive[propName] = prop.active;
    }
    group.details.smartObjects = [group.smartObject];

    this.parent.createSmartGroup(group);
  }

  onSODeleteGroup(groupName) {
    let index = this.elemData.details.groups.indexOf(groupName);
    if (index < 0) {
      throw new Error("Not found group name");
    }

    delete this.elemData.groups[index];
    this.parent.deleteSmartGroupFromObject(this.elemData.name, groupName);
    this.parent.saveElement(this);
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

  onSGDeleteSmartObject(smartObject) {
    let index = this.elemData.smartObjects.indexOf(smartObject);
    if (index < 0) {
      throw new Error("Not found smart object name");
    }

    delete this.elemData.smartObjects[index];
    this.parent.deleteSmartObjectFromGroup(this, smartObject);
    this.parent.saveElement(this);
  }
  // --- End SmartGroup Actions ---

  render() {
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
          onDeleteGroup: (groupName) => this.onSODeleteGroup(groupName),
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
          onDeleteSmartObject: (smartObject) =>
            this.onSGDeleteSmartObject(smartObject),
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
        throw new Error("not xisting type in SO EDITOR");
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
