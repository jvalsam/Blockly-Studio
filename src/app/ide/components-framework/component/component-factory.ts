/**
 * ComponentFactory - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * May 2017
 */

import { Component } from './component';
import { ComponentRegistry } from './component-registry';

class ComponentFactory {
    CreateComponent(compName: string): Component {
      const component = ComponentRegistry.getComponentEntry(compName).create();
      return component;
    }

    DestroyComponent(component: Component): void {
      ComponentRegistry.getComponentEntry(component.name).destroy(component);
    }
}
