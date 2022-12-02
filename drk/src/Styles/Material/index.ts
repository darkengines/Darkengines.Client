import mdcButtonCss from '!raw-loader!@material/button/dist/mdc.button.css';
import mdcTextfieldCss from '!raw-loader!@material/textfield/dist/mdc.textfield.css';
import { styles as mwcTextfieldStyles } from '@material/mwc-textfield/mwc-textfield.css';
import mdcTypographyCss from '!raw-loader!@material/typography/dist/mdc.typography.css';
import mdcElevationCss from '!raw-loader!@material/elevation/dist/mdc.elevation.css';
import { unsafeCSS } from 'lit';

const mdcButton = unsafeCSS(mdcButtonCss);
const mdcTypography = unsafeCSS(mdcTypographyCss);
const mdcElevation = unsafeCSS(mdcElevationCss);
const mdcTextfield = unsafeCSS(mdcTextfieldCss);
const mdcStyles = [mdcButton, mdcTypography, mdcElevation, mdcTextfield];
export { mdcStyles, mdcButton, mdcTypography, mdcElevation, mdcTextfield, mwcTextfieldStyles };
