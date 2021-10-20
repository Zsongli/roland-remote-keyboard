export default function hold(element: HTMLElement, button: number) {

    function mousedown(e) {
        e.button === button && element.dispatchEvent(new CustomEvent<any>("hold"));
    }
    element.addEventListener("mousedown", mousedown);

    function mouseup(e) {
        e.button === button && element.dispatchEvent(new CustomEvent<any>("release"));
    }
    element.addEventListener("mouseup", mouseup);

    function spacedown(e: KeyboardEvent) {
        e.key === " " && element.dispatchEvent(new CustomEvent<any>("hold"));
    }
    element.addEventListener("keydown", spacedown);
    
    function spaceup(e: KeyboardEvent) {
        e.key === " " && element.dispatchEvent(new CustomEvent<any>("release"));
    }
    element.addEventListener("keyup", spaceup);

    function touchstart() {
        element.dispatchEvent(new CustomEvent<any>("hold"));
    }
    element.addEventListener("touchstart", touchstart);

    function touchend() {
        element.dispatchEvent(new CustomEvent<any>("release"));
    }
    element.addEventListener("touchend", touchend);

    return {
        destroy: () => {
            element.removeEventListener("mousedown", mousedown);
            element.removeEventListener("mouseup", mouseup);
            element.removeEventListener("keydown", spacedown);
            element.removeEventListener("keyup", spaceup);
            element.removeEventListener("touchstart", touchstart);
            element.removeEventListener("touchend", touchend);
        }
    }
}