export function CollaborationSharePopup(container){
    let html = '\
    <div class = "popup-opacity"> </div>\
    <div class = "collaboration-popup">\
        <div class = "collaboration-popup-header-bar vcenter">\
            <div class = "collaboration-popup-header-text"> Collaboration </div>\
            <div class = "collaboration-popup-header-x middle-right size18x18"></div>\
        </div>\
        <div class = "collaboration-popup-content-container center">\
            <div>\
                <div class = "collaboration-popup-row center">\
                    <div class = "vcenter" style = "display: inline-flex">\
                        <div class = "collaboration-popup-user-icon"> </div>\
                        <div class = "collaboration-popup-edit"> Edit </div>\
                    </div>\
                    \
                </div>\
                <div class = "collaboration-popup-row center">\
                    <input type="text" id="collaboration-share-name" placeholder="e.g. John Doe">\
                </div>\
                <div class = "collaboration-popup-row center">\
                    <input type="button" id="collaboration-share-button" value="SHARE">\
                </div>\
            </div>\
        </div>\
    </div>\
    ';
    if (typeof container === 'string')
        $('#' + container).append(html);
    else
        container.append(html);
    
    let onnCloseCb = undefined, onShareCb = undefined;

    this.setOnCloseCb = function(cb){
        onnCloseCb = cb;
    }

    this.setOnShareCb = function(cb){
        onShareCb = cb;
    }

    function getName(){
        return $("#" + "collaboration-share-name").val();
    }

    function getIcon(){
        let imageUrl = $(".collaboration-popup-user-icon").css("background-image");
        return imageUrl.slice(5 /* url(" */,imageUrl.length -  2);
    }

    function closePopup(){
        $(".collaboration-popup").remove();
        $(".popup-opacity").remove();
        if (onnCloseCb)
            onnCloseCb();
    }

    this.getName = getName;
    this.closePopup = closePopup;

    $("#collaboration-share-button").click(function(){
        let name = getName();
        let icon = getIcon();
        $(".collaboration-popup").remove();
        $(".popup-opacity").remove();
        if (onShareCb)
            onShareCb({
                name: name, 
                icon: icon
            });
    });

    $(".popup-opacity").click(function(){
        closePopup();
    });

    $(".collaboration-popup-header-x").click(function() {
        closePopup();
    });
}

// $(function () {
//     let csp = new CollaborationSharePopup("sharePopup");
//     let cjp = new CollaborationJoinPopup("joinPopup");
// });

export function CollaborationJoinPopup(container){
    let html = '\
    <div class="collaboration-popup">\
        <div class="collaboration-popup-header-bar vcenter">\
            <div class="collaboration-popup-header-text"> Collaboration </div>\
            <div class="collaboration-popup-header-x middle-right size18x18"></div>\
        </div>\
        <div class="collaboration-popup-content-container center">\
            <div>\
                <div class="collaboration-popup-row center">\
                    <div class="vcenter" style="display: inline-flex">\
                        <div class="collaboration-popup-user-icon"> </div>\
                        <div class="collaboration-popup-edit"> Edit </div>\
                    </div>\
                \
                </div>\
                <div class="collaboration-popup-row center">\
                    <input type="text" id="collaboration-join-name" placeholder="e.g. John Doe">\
                </div>\
                \
                <div class="collaboration-popup-row center">\
                    <input type="text" id="collaboration-join-link" placeholder="e.g. #dd76gocrFVt30PJg">\
                </div>\
                \
                <div class="collaboration-popup-row center">\
                    <input type="button" id="collaboration-join-button" value="JOIN">\
                </div>\
            </div>\
        </div>\
    </div>\
    ';
    if (typeof container === 'string')
        $('#' + container).append(html);
    else
        container.append(html);
}