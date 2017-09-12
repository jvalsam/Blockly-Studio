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
      const component = ComponentRegistry.GetComponentEntry(compName).Create();
      return component;
    }

    DestroyComponent(component: Component): void {
      ComponentRegistry.GetComponentEntry(component.name).Destroy(component);
    }
}
