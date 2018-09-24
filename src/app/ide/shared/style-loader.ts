


export function LoadStyle (name: string, type: string, style: string) {
    // create css element for the view
    let css = document.createElement("style");
    css.setAttribute("id", "stylesheet_"+name+"_"+type);
    css.setAttribute("type", "text/css");
    css.innerHTML = style;

    // pin css in DOM
    document.getElementsByTagName('head')[0].appendChild(css);
}

export function UnloadStyle (name: string, type: string) {
    document.getElementById("stylesheet_"+name+"_"+type).remove();
}