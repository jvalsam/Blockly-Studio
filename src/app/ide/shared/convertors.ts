

export function HexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function RGBToHex(color) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

export function ContrastColor(color) {
    let luminance = ( 0.299 * color.r + 0.587 * color.g + 0.114 * color.b)/255;
    return luminance > 0.5 ? "rgb(0,0,0)" : "rgb(255,255,255)";
}

export function Color(color) {
    let luminance = ( 0.299 * color.r + 0.587 * color.g + 0.114 * color.b)/255;
    return luminance > 0.5 ? "rgb(255,255,255)" : "rgb(0,0,0)";
}

export function BrighterVersion (color) {
    let darker: any = {};
    if (typeof(color) === "string") {
        color = HexToRGB(color);
    }
    darker.r = Math.round(color.r * 1.05);
    darker.g = Math.round(color.g * 1.05);
    darker.b = Math.round(color.b * 1.05);
    return RGBToHex(darker);
}

export function DarkerVersion (color) {
    let brighter: any = {};
    if (typeof(color) === "string") {
        color = HexToRGB(color);
    }
    brighter.r = Math.round(color.r * 0.95);
    brighter.g = Math.round(color.g * 0.95);
    brighter.b = Math.round(color.b * 0.95);
    return RGBToHex(brighter);
}
