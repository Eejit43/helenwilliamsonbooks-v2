// @ts-ignore (URL import, types added below)
import toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js';

declare function toastify(options: {
    text: string;
    duration: number;
    position: string;
    style: {
        [key: string]: string;
    };
}): {
    showToast: () => void;
};

/**
 * Displays a popup alert
 * @param {string} text The string to display
 * @param {'success'|'error'|string} color 'success', 'error', or color
 * @param {number} [duration] The duration of the popup in milliseconds
 */
export function showAlert(text: string, color: 'success' | 'error' | string, duration?: number) {
    color = color.toLowerCase();
    if (color === 'success') color = '#009c3f';
    if (color === 'error') color = '#ff5555';
    toastify({
        text: text || 'No text specified!',
        duration: duration || 4000,
        position: 'center',
        style: {
            background: '#c1e7fb',
            border: '1px solid #b4b4b4',
            borderRadius: '6px',
            boxShadow: 'none',
            color: color || '#009c3f',
            fontFamily: '"Quattrocento Sans", sans-serif',
            fontSize: '17px',
            fontWeight: '600',
            minWidth: '150px',
            padding: '16px 30px',
            textAlign: 'center'
        }
    }).showToast();
}
