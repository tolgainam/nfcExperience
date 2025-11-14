/**
 * Font Loading Utility
 *
 * Dynamically injects @font-face rules with the correct base path for GitHub Pages.
 * This is necessary because CSS url() in the public folder doesn't get processed by Vite.
 */

import { getPublicAssetUrl } from './assetUrl'

/**
 * Inject font-face rules with correct base URL into the document
 * Call this once at app initialization
 */
export function loadFonts() {
  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-family: 'IQOS';
      src: url('${getPublicAssetUrl('/IQOSW10-Regular.woff')}') format('woff');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'IQOS';
      src: url('${getPublicAssetUrl('/IQOSW10-Bold.woff2')}') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
  `
  document.head.appendChild(style)
}
