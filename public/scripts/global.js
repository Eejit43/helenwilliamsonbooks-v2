/* global bootstrap */

import '/scripts/image-popup.js';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map((element) => new bootstrap.Tooltip(element));
