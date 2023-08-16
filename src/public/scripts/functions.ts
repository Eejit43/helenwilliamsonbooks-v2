// @ts-ignore (URL import, types added below)
import toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js';

declare function toastify(options: { text: string; duration: number; position: string; style: Record<string, string> }): {
    showToast: () => void;
};

/**
 * Displays a popup alert.
 * @param text The string to display.
 * @param type The color type (`'success'`, `'error'`, `'warning'`, or `'info'`).
 * @param duration The duration of the popup in milliseconds.
 */
export function showAlert(text: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) {
    const processedType = type === 'info' ? 'main' : type;
    toastify({
        text: text || 'No text specified!',
        duration: duration ?? 4000,
        position: 'center',
        style: {
            background: `var(--${processedType}-color-100)`,
            border: `1px solid var(--${processedType}-color-300)`,
            borderRadius: '6px',
            boxShadow: 'none',
            color: `var(--${processedType}-color-500)`,
            fontFamily: 'var(--font-family-sans)',
            fontWeight: '600',
            minWidth: '120px',
            textAlign: 'center',
        },
    }).showToast();
}
