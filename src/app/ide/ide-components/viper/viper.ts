/**
 * Component - Each Component will register in the system will inherits component class
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * May 2017
 */

import { Component } from '../../components-framework/component';
import { VPLDescription } from './vpl-description';

export class ViperPL extends Component {
    constructor(
        protected readonly _name: string,
        protected readonly _description: string,
        protected _isActive: boolean = true,
        protected _isVisible: boolean = false
    ) {
        super(_name, _description, _isActive, _isVisible);
    }

    public Destroy(){}
}
