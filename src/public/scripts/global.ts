// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword, @typescript-eslint/no-namespace
declare module bootstrap {
    class Tooltip {
        constructor(element: Element);
    }
}

import './image-popup.js';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map((element) => new bootstrap.Tooltip(element));
