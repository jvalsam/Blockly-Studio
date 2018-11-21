import {upload_files_url} from "./../shared/data";

function handle_response_errors(response) {
    let json = response.json();
    if (!response.ok) {
        throw Error(json);
    }
    return json;
}

export function upload_files(files, on_success, on_failure) {
    fetch(
        upload_files_url,
        {
            method: "POST",
            body: files
        }
    )
    .then(handle_response_errors)
    .then(on_success)
    .then(on_failure);
}