// Chuck Norris doesn't need JavaScript. JavaScript executes itself out of fear.

// #4 — Roundhouse kick animation trigger
export function triggerKick(element) {
    element.classList.remove('kick');
    void element.offsetWidth; // force reflow to restart animation
    element.classList.add('kick');
}


export function initChuckNorris() {
    const facts = [
        "Chuck Norris can divide by zero.",
        "Chuck Norris doesn't debug. Bugs confess.",
        "Chuck Norris's code compiles on the first try. Always.",
        "Chuck Norris doesn't use DevTools. The browser reports to him directly.",
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    console.log(
        "%c🥋 Chuck Norris is watching your console.",
        "color: #b22222; font-weight: bold; font-size: 14px;"
    );
    console.log(`%c💡 "${fact}"`, "color: #888; font-style: italic;");
}

// #2 — Konami Code listener
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"];
let konamiIndex = 0;

export function initKonamiCode(dotnetRef) {
    document.addEventListener("keydown", (e) => {
        if (e.key === KONAMI[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === KONAMI.length) {
                konamiIndex = 0;
                dotnetRef.invokeMethodAsync("OnKonamiCode");
            }
        } else {
            konamiIndex = e.key === KONAMI[0] ? 1 : 0;
        }
    });
}

export function disposeKonamiCode() {
    konamiIndex = 0;
}
