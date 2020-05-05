

export function openStartSessionDialogue(
    $dialog,   // jquery selector
    $container,
    onSuccess, // cb
    onFailure   // cb
    ) {
        onSuccess({
            name: "alex",
            icon: "myIcon"
        });
}

export function openJoinSessionDialogue(
    $dialog,   // jquery selector
    onSuccess, // cb
    onFailure   // cb
    ) {
        onSuccess({
            name: "a",
            icon: "myIcon"
        },document.getElementById("toparathiraki").value);
}