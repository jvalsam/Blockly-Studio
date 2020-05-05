

export function openStartSessionDialogue(
    $dialog,   // jquery selector
    $container,
    onSuccess, // cb
    onFailure   // cb
    ) {
        onSuccess({
            name: "alex",
            icon: "myIcon"
        },
        {
            //TODO: return array of shared pitem ids
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