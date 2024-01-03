// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword, @typescript-eslint/no-namespace
declare module bootstrap {
    class Tooltip {
        constructor(element: Element, options: { placement: string });
    }
}

import './image-popup.js';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
for (const element of tooltipTriggerList) new bootstrap.Tooltip(element, { placement: 'bottom' });
