import { RunPlatformData } from "./../shared/data";

function handle_response_errors(response) {
    let json = response.json();
    if (!response.ok) {
        throw Error(json);
    }
    return json;
}

export function upload_files(files, on_success, on_failure) {
    fetch(
        RunPlatformData.UPLOAD_FILES_URL,
        {
            method: "POST",
            body: files
            // ,
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // }
        }
    )
    .then(handle_response_errors)
    .then(on_success)
    // .catch((response) => on_failure(response));
}