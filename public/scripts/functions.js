import toastify from 'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.2/toastify-es.js';

/**
 * Displays a popup alert
 * @param {string} text The string to display
 * @param {string} color 'success', 'error', or color
 * @param {number} duration The duration of the popup in milliseconds
 */
export function showAlert(text, color, duration) {
    color = color.toLowerCase();
    if (color === 'success') color = '#009c3f';
    if (color === 'error') color = '#ff5555';
    toastify({
        text: text || 'No text specified!',
        duration: duration || 4000,
        position: 'center',
        style: {
            background: '#fafbfc',
            border: '1px solid rgba(27, 31, 35, 0.15)',
            borderRadius: '6px',
            boxShadow: 'none',
            color: color || '#009c3f',
            fontFamily: '"Quattrocento Sans", sans-serif',
            fontSize: '17px',
            fontWeight: '600',
            minWidth: '150px',
            padding: '16px 30px',
            textAlign: 'center',
        },
    }).showToast();
}
