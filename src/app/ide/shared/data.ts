const _URL_DEBUG: string = "http://localhost:3031/";
const _URL: string = "http://147.52.17.129:3031/";

const _MONGO_URL_DEBUG: string = "mongodb://puppy1:puppy1234@147.52.17.129:3032/Puppy";
const _MONGO_URL_DEBUG_LOCALHOST: string = "mongodb://localhost:27017/Puppy";
const _MONGO_URL: string = "mongodb://puppy1:puppy1234@localhost:3032/Puppy";

export const iotivity_url: string = "http://147.52.17.129:3030/smart-objects/scan";

// export const smart_objects_backend_url: string = "http://147.52.17.129:3031/smart-objects";
export const smart_objects_backend_url: string = "http://localhost:3031/smart-objects";

const _UPLOAD_FILES_URL_DEBUG: string = "http://localhost:3031/files/upload";
const _UPLOAD_FILES_URL_RELEASE: string = "http://147.52.17.129:3031/files/upload";

export const MODAL_SELECTOR: string = ".modal-view-area";

export type RunModeType = "debug" | "debug_localhost" | "release" | "production";

class _RunPlatformData {
    private _URL: string;
    private _MONGO_URL: string;
    private _UPLOAD_FILES_URL: string;

    public initialize (mode: RunModeType) {
        switch (mode) {
            case "debug":
                this._URL = _URL_DEBUG;
                this._MONGO_URL = _MONGO_URL_DEBUG;
                this._UPLOAD_FILES_URL = _UPLOAD_FILES_URL_DEBUG;
                break;
            case "debug_localhost":
                this._URL = _URL_DEBUG;
                this._MONGO_URL = _MONGO_URL_DEBUG_LOCALHOST;
                this._UPLOAD_FILES_URL = _UPLOAD_FILES_URL_RELEASE;
                break;
            default:
                this._URL = _URL;
                this._MONGO_URL = _MONGO_URL;
                this._UPLOAD_FILES_URL = _UPLOAD_FILES_URL_RELEASE;
        }
    }

    public get URL(): string { return this._URL; }
    public get MONGO_URL(): string { return this._MONGO_URL; }
    public get UPLOAD_FILES_URL(): string { return this._UPLOAD_FILES_URL; }
}
export let RunPlatformData = new _RunPlatformData();
