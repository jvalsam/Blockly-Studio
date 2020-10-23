import "./init.js";
import {dispatcher} from "./init.js";
import './actions/actions.js';

onmessage = function (msg) {
    let obj = msg.data;
    dispatcher[obj.type](obj.data);
}