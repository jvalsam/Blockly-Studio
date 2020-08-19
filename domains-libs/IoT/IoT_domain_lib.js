import * as IoTivity from "./iotivity_communication";

// Map { [selector:string]: { uri: string, colour: string } }
var _SOViews = {};
var timerId;

function RequestUpdateSOsState () {
    IoTivity.get_online_smart_objects(
        (smartobjects) => {
            Object.keys(_SOViews).forEach((selector) => {
                _SOViews[selector].colour = ( smartobjects.map(x=>x.uri).indexOf(_SOViews[selector].uri) > -1 ) ? "green" : "red";
            });
        }
    );
}

function StartSOStateObserver () {
    timerId = setTimeout( () => RequestUpdateSOsState(()=>StartSOStateObserver()), 5000);
}

function StopSOStateObserver () {
    clearTimeout(timerId);
}


// SOData: {uri: string, selector: string}
// return  { render: Function, destroy: Function }
export function ProjectManagerSOState (SOData) {
    // IoTivity.get_online_smart_objects(
        // (smartobjects) => {
    var viewID = SOData.uri.replace(/\//g , "_");
    _SOViews[viewID] = { colour: "grey", uri: SOData.uri };
    if (Object.keys(_SOViews).length === 1) {
        StartSOStateObserver();
    }

    return {
        render: () => {
            var $el = $("<i class='fas fa-circle' id='"+viewID+"'></i>");
            $el.css("color", _SOViews[viewID].colour);
            $(SOData.selector).empty();
            $(SOData.selector).append($el);
        },
        destroy: () => {
            $(SOData.selector).empty();
            delete _SOViews[viewID];
            if (Object.keys(_SOViews).length === 0) {
                StopSOStateObserver();
            }
        }
    };
}
