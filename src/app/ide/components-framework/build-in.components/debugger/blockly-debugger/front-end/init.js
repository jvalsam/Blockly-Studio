export var Debuggee_Worker = (function (){
	var instance;
	var dispatcher = {};
	  
	function getInstance(){
		if(instance === undefined){
			instance = new Worker("./dist/debuggee.js");	 // to path apo to localhost kai oxi apo edw
			initDispacher();
			instance.onmessage = function(msg) {
                let obj = msg.data;
                let data = obj.data;
                dispatcher[obj.type](data);
            };
		}		
	return instance;	
	}

	function Stop(){
		if(!hasInstance()) return;
		instance.terminate();
		instance = undefined;
	}

	function AddOnDispacher(event, callback){
		dispatcher[event] = callback;
	}


	function hasInstance(){
	 	if(instance === undefined) return false;
	 	else return true;
	}

	function initDispacher(){
		dispatcher["alert"] = (msg) => {
					window.alert(msg);
					Debuggee_Worker.Instance().postMessage({"type":"alert","data": ""});
				};
		dispatcher["prompt"] = (msg) => {
					Debuggee_Worker.Instance().postMessage({"type":"prompt","data": window.prompt(msg)}); 					
				};
		dispatcher["highlightBlock"] = (data) => {
							window.workspace[data.CurrentSystemEditorId].traceOn_ = true;
							window.workspace[data.CurrentSystemEditorId].highlightBlock(data.id);
				}; 						
		dispatcher["execution_finished"] = () => {
					instance = undefined;
					document.getElementById("val_table").innerHTML = '';
				};		
	};

	return {
		Instance : getInstance,
		Stop: Stop,
		AddOnDispacher: AddOnDispacher,
		hasInstance: hasInstance
	};

})();

export var Blockly_Debugger = {};
Blockly_Debugger.actions = {};
