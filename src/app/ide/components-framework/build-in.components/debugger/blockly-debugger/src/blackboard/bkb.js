///////////////////////////////////////////////////////////
// Very simply blackboard with function lists per event id.
// Anthony Savidis, March 2019
///////////////////////////////////////////////////////////

var handlers = {};
export var bkb = {};

///////////////////////////////////////////////////////////

bkb.assert = function (expr, msg) {
    if (!expr)
        alert("assertion failure!\n" + msg);
}

///////////////////////////////////////////////////////////

bkb.install = function (eventId, f) {
    let l = handlers[eventId];
    if (l == undefined)
        l = handlers[eventId] = new Array();
    l.push(f);
}

///////////////////////////////////////////////////////////

bkb.invoke = function (eventId) {

    let funcs = handlers[eventId];
    this.assert(funcs != undefined, "undefined event:" + eventId);

    let args = new Array();
    for (var i = 1; i < arguments.length; i++)
        args[i - 1] = arguments[i];

    for (var i = 0; i < funcs.length; ++i)
        funcs[i].apply(this, args);
}

///////////////////////////////////////////////////////////
