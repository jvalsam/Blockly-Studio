import {
    Blockly_Debugger
} from './src/debugger/debugger.js';


addEventListener("updateTable", function () {
    let variables = Blockly_Debugger.actions["Variables"].getVariables();
    document.getElementById("variables").innerHTML = '';
    for (var i = 0; i < variables.length; ++i) {
        var red_style = ``;
        if (variables[i].change === true) red_style = `style=\"color:red;\"`;
        document.getElementById("variables").innerHTML += `<tr>
                                                            <td ` + red_style + `>` + variables[i].name + `</td>
                                                            <td ` + red_style + `>` + variables[i].value + `</td>
                                                            <td ` + red_style + `>` + typeof variables[i].value + `</td>
                                                          </tr>`;
    }
});

addEventListener("updateWatchesTable", function () {
    let watches = Blockly_Debugger.actions["Watch"].getWatches();
    document.getElementById("watches").innerHTML = '';
    for (var i = 0; i < watches.length; ++i) {
        var red_style = ``;
        if (watches[i].change === true) red_style = `style=\"color:red;\"`;
        document.getElementById("watches").innerHTML += `<tr>
                                                            <td ` + red_style + `>` + watches[i].name + `</td>
                                                            <td ` + red_style + `>` + watches[i].code + `</td>
                                                            <td ` + red_style + `>` + watches[i].value + `</td>
                                                            <td ` + red_style + `>` + typeof watches[i].value + `</td>
                                                        </tr>`;
    }
});

addEventListener('keydown', (event) => {
    switch (event.key.toUpperCase()) {
        case 'S':
            event.preventDefault();
            var blocks = Blockly.Xml.workspaceToDom(window.workspace["blockly1"], true).childNodes;
            var output = "";
            blocks.forEach(e => {
                if (e.localName == "block") {
                    output += "\n";
                    output += e.outerHTML;
                }
            });
            console.log(output);
            break;
    }
});
