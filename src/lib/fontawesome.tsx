// FontAwesome configuration to prevent icon flash (FOUC)
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Tell FontAwesome to skip adding the CSS automatically
// since we imported it above to be included in SSR
config.autoAddCss = false;

export default config;
