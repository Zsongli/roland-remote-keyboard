export default function hold(element: HTMLElement, button: number) {

    function mousedown(e: MouseEvent) {
        e.button === button && element.dispatchEvent(new CustomEvent("hold"));
    }
    element.addEventListener("mousedown", mousedown);

    function mouseup(e: MouseEvent) {
        e.button === button && element.dispatchEvent(new CustomEvent("release"));
    }
    element.addEventListener("mouseup", mouseup);

    function spacedown(e: KeyboardEvent) {
        e.key === " " && element.dispatchEvent(new CustomEvent("hold"));
    }
    element.addEventListener("keydown", spacedown);
    
    function spaceup(e: KeyboardEvent) {
        e.key === " " && element.dispatchEvent(new CustomEvent("release"));
    }
    element.addEventListener("keyup", spaceup);

    function touchstart() {
        element.dispatchEvent(new CustomEvent("hold"));
    }
    element.addEventListener("touchstart", touchstart);

    function touchend() {
        element.dispatchEvent(new CustomEvent("release"));
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