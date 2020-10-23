import '../debugger/debugger.js';
import '../generator/blockly/blockly.js';
import {Blockly_Debugger} from '../debugger/debugger.js'; 


addEventListener("updateTable",function (){
    let variables = Blockly_Debugger.actions["Variables"].getVariables();
    document.getElementById("variables").innerHTML = '';
    for(var i = 0; i<variables.length; ++i){
        var red_style = ``;
        if(variables[i].change === true) red_style = `style=\"color:red;\"`;
        document.getElementById("variables").innerHTML += `<tr>
                                                            <td ` + red_style + `>` + variables[i].name + `</td>
                                                            <td ` + red_style + `>` +  variables[i].value + `</td>
                                                            <td ` + red_style + `>` + typeof variables[i].value + `</td>
                                                          </tr>`;
    }
});


addEventListener("updateWatchesTable",function (){
    let watches = Blockly_Debugger.actions["Watch"].getWatches();
    document.getElementById("watches").innerHTML = '';
    for(var i = 0; i<watches.length; ++i){
        var red_style = ``;
        if(watches[i].change === true) red_style = `style=\"color:red;\"`;
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
        var blocks = Blockly.Xml.workspaceToDom(window.workspace["blockly1"],true).childNodes;
        var output = "";
        blocks.forEach(e => {
            if(e.localName == "block"){
                output += "\n";
                output += e.outerHTML;
            }
        });
        console.log(output);
        break;
    }
});



// const data = new Uint8Array(Buffer.from('Hello Node.js'));
// fs.writeFile('message.txt', data, (err) => {
//   if (err) throw err;
//   console.log('The file has been saved!');
// });

// const fs = require('fs');
// fs.writeFile('test.txt', 'Hello content!', function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });


// fs.writeFile('message.txt', 'Hello Node.js', 'utf8', callback);

