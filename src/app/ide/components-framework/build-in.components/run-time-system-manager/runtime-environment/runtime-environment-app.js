/**
 * 
 */


class RuntimeEnvironmentApp {
    constructor() {
        alert('Runtime environment instance created!');

        window.top.postMessage('send-runtime-environment-data', '*');
        window.onmessage = (event) => {
            let msgData = JSON.parse(event.data);
            console.log('Parent received successfully.');
            console.log(msgData);
        }
    }
}

const runtimeEnvironment = new RuntimeEnvironmentApp();