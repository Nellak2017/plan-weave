/* eslint-disable max-lines */
import { css } from 'styled-components'
const elevations = {
  extraSmall: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)', // 1dp : elements closest to application background, like cards
  small: '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12)', // 3dp : tooltips, banners, elevated buttons, FAB
  medium: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)', // 6dp : contextual overlays for components, Menu, Dropdown, Nav bar
  large: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)', // 8dp : element that rise above most, like dialouges, time picker, search bar
  extraLarge: '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)'
} // 12dp : elements highest in stacking order, like notifications
const insets = { normal: '1px 1px 5px rgba(1, 1, 0, 0.7) inset' }
const fontSizes = { extraSmall: '10px', smaller: '12px', small: '14px', medium: '16px', large: '24px', larger: '40px', extraLarge: '64px' }
const spaces = { smaller: '4px', small: '8px', medium: '16px', large: '32px', larger: '48px', extraLarge: '56px' }
const breakpoints = { xs: '320px', sm: '425px', md: '768px', lg: '1024px', xl: '1440px' } // small phones, large phones, ipads, laptops, desktops
const colorPreset = {
  primary: css`
    color: ${props => props.theme.colors.primaryLight};
    background-color: ${props => props.theme.colors.primary};
    &:hover {
      background-color: ${props => props.theme.colors.primaryHover};
    }
    &:active {
      background-color: ${props => props.theme.colors.primaryActive};
    }
  `,
  darkNeutral: css`
    color: ${props => props.theme.colors.darkNeutralLight};
    background-color: ${props => props.theme.colors.darkNeutral};
    &:hover {
      background-color: ${props => props.theme.colors.darkNeutralHover};
    }
    &:active {
      background-color: ${props => props.theme.colors.darkNeutralActive};
    }
  `,
  lightNeutral: css`
    color: ${props => props.theme.colors.lightNeutralLight};
    background-color: ${props => props.theme.colors.lightNeutral};
    &:hover {
      background-color: ${props => props.theme.colors.lightNeutralHover};
    }
    &:active {
      background-color: ${props => props.theme.colors.lightNeutralActive};
    }
  `,
  danger: css`
    color: ${props => props.theme.colors.dangerLight};
    background-color: ${props => props.theme.colors.danger};
    &:hover {
      background-color: ${props => props.theme.colors.dangerHover};
    }
    &:active {
      background-color: ${props => props.theme.colors.dangerActive};
    }
  `,
  success: css`
    color: ${props => props.theme.colors.successLight};
    background-color: ${props => props.theme.colors.success};
    &:hover {
      background-color: ${props => props.theme.colors.successHover};
    }
    &:active {
      background-color: ${props => props.theme.colors.successActive};
    }
  `,
  warning: css`
    color: ${props => props.theme.colors.warningLight};
    background-color: ${props => props.theme.colors.warning};
    &:hover {
      background-color: ${props => props.theme.colors.warningHover};
    }
    &:active {
      background-color: ${props => props.theme.colors.warningActive};
    }
  `,
  transparent: css`
    color: #fff;
    background-color: transparent;
    &:hover {
      background-color: transparent;
    }
    &:active {
      background-color: transparent;
    }
  `
}
// --- ATOMS ---

// normal medium, but small default
export const buttonPreSets = {
  variant: {
    standardButton: css``,
    newTask: css`
      padding-left: ${props => props.theme.spaces.small};
      padding-right: ${props => props.theme.spaces.small};
      background-color: ${props => props.theme.colors.successDark};
      &:hover {
        background-color: ${props => props.theme.colors.successHover};
      }
      &:active {
        background-color: ${props => props.theme.colors.successActive};
      }
    `,
    delete: css`
      background-color: ${props => props.theme.colors.danger};
      &:hover {
        background-color: ${props => props.theme.colors.dangerHover};
      }
      &:active {
        background-color: ${props => props.theme.colors.dangerActive};
      }
    `
  },
  size: {
    xs: css`
    padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.smaller};
    font-size: ${props => props.theme.fontSizes.extraSmall};
  `,
    s: css`
    padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.small};
    font-size: ${props => props.theme.fontSizes.smaller};
  `,
    m: css`
    padding: ${props => props.theme.spaces.medium} ${props => props.theme.spaces.medium};
    font-size: ${props => props.theme.fontSizes.medium};
  `,
    l: css`
    padding: ${props => props.theme.spaces.large} ${props => props.theme.spaces.large};
    font-size: ${props => props.theme.fontSizes.large};
  `,
    xl: css`
    padding: ${props => props.theme.spaces.larger} ${props => props.theme.spaces.larger};
    font-size: ${props => props.theme.fontSizes.larger};
  `
  },
  color: colorPreset
}

// normal medium, but small default
export const dropDownButtonPreSets = {
  size: {
    xs: css`
      padding: ${props => props.theme.spaces.smaller} ${props => props.theme.spaces.smaller};
      border-radius: ${props => props.theme.spaces.small};
      font-size: ${props => props.theme.fontSizes.extraSmall};
    `,
    s: css`
      padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.small};
      font-size: ${props => props.theme.fontSizes.smaller};
    `,
    m: css`
      padding: ${props => props.theme.spaces.medium} ${props => props.theme.spaces.medium};
      font-size: ${props => props.theme.fontSizes.medium};
    `,
    l: css`
      padding: ${props => props.theme.spaces.large} ${props => props.theme.spaces.large};
      font-size: ${props => props.theme.fontSizes.large};
    `,
    xl: css`
      padding: ${props => props.theme.spaces.larger} ${props => props.theme.spaces.larger};
      font-size: ${props => props.theme.fontSizes.larger};
    `
  },
  color: colorPreset,
}

export const nextButtonPreSets = {
  variant: {
    left: css``,
    right: css``
  },
  size: {},
  color: colorPreset
}

export const ellipsesButtonPreSets = {
  variant: {
    light: css`
      color: ${props => props.theme.colors.lightNeutral};
      &:hover {
        color: ${props => props.theme.colors.lightNeutralLightHover};
      }
      &:active {
        color: ${props => props.theme.colors.primaryActive};
      }
    `,
    dark: css`
      color: ${props => props.theme.colors.lightNeutralLight};
    `
  },
  // Note: spaces is used for font sizes because it is supposed to be an 'Icon'
  size: {
    xs: css`
    padding: 4px 5.1px 8px 5.1px; // Default for extra small, 16 x 16
    font-size: ${props => props.theme.spaces.small};
  `,
    s: css`
    padding: 8px 10.25px 16px 10.25px; // Default for small, 32 x 32
    font-size: ${props => props.theme.spaces.medium};
  `,
    m: css`
    padding: 16px 20.5px 32px 20.5px; // Default for medium, 64 x 64
    font-size: ${props => props.theme.spaces.large};
  `,
    l: css`
    padding: 22px 29.75px 48px 29.75px; // Default for large, 94 x 94
    font-size: ${props => props.theme.spaces.larger};
  `,
    xl: css`
    padding: 28px 43.75px 72px 43.75px; // Default for large, 128 x 128
    font-size: ${props => props.theme.spaces.extraLarge};
  `
  },
  color: colorPreset
}

export const searchBarPreSets = {
  variant: {
    light: css`
      background-color: ${props => props.theme.colors.lightNeutralLight};
      color: ${props => props.theme.colors.darkNeutral};
      border: 1px solid ${props => props.theme.colors.lightNeutral}60;
      input {
        color: ${props => props.theme.colors.darkNeutral}60;
        &::placeholder {
    	    color: ${props => props.theme.colors.darkNeutral}60; /* Placeholder color */
  	    }
        &:hover,
        &:focus,
        &:active {
          color: ${props => props.theme.colors.darkNeutral};
          &::placeholder {
    	      color: ${props => props.theme.colors.darkNeutral}; /* Placeholder color */
  	      }
        }
        &:active,
        &:focus {
          &::placeholder {
            color: ${props => props.theme.colors.darkNeutral}00; /* Placeholder color */
          }
        }
        &:focus ~ svg,
        &:hover ~ svg {
          color: ${props => props.theme.colors.darkNeutral};
        }
      }
    `,
    dark: css`
      background-color: ${props => props.theme.colors.lightNeutral};
      color: ${props => props.theme.colors.lightNeutralLight};
      border: 1px solid ${props => props.theme.colors.lightNeutralLight}60;
      input {
        color: ${props => props.theme.colors.lightNeutralLight}60;
        &:hover,
        &:focus, 
        &:active {
          color: ${props => props.theme.colors.lightNeutralLight};
          &::placeholder {
            color: ${props => props.theme.colors.lightNeutralLight}; 
          }
        }
        &:active,
        &:focus {
          &::placeholder {
            color: ${props => props.theme.colors.lightNeutralLight}00; 
          }
        }
        &:focus ~ svg,
        &:hover ~ svg {
          color: ${props => props.theme.colors.lightNeutralLight};
        }
      }
    `,
  },
}

export const taskInputPreSets = {
  variant: {
    light: css`
      color: ${props => props.theme.colors.lightNeutral};
      &::placeholder {
        color: ${props => props.theme.colors.lightNeutral}60;
      }
      &:hover {
		    color: ${props => props.theme.colors.lightNeutralHover};
        &::placeholder {
          color: ${props => props.theme.colors.lightNeutralHover}60;
        }
      }
      &:focus {
        color: ${props => props.theme.colors.lightNeutralActive};
        &::placeholder {
          color: ${props => props.theme.colors.lightNeutralActive}60;
        }
      }
    `,
    dark: css`
      color: ${props => props.theme.colors.lightNeutralLight};
      &::placeholder {
        color: ${props => props.theme.colors.lightNeutralLight}60;
      }
      &:hover {
		    color: ${props => props.theme.colors.lightNeutralLightHover};
        &::placeholder {
          color: ${props => props.theme.colors.lightNeutralLightHover}60;
        }
      }
      &:focus {
        color: ${props => props.theme.colors.lightNeutralLight};
        &::placeholder {
          color: ${props => props.theme.colors.lightNeutralLightActive}60;
        }
      }
    `,
  },
  color: colorPreset,
}

export const hoursInputContainerPreSets = {
  variant: {
    light: css`
      & > span {
        color: ${props => props.theme.colors.lightNeutral};
          &::placeholder {
            color: ${props => props.theme.colors.lightNeutral}60;
          }
          &:hover {
            color: ${props => props.theme.colors.lightNeutralHover};
            &::placeholder {
              color: ${props => props.theme.colors.lightNeutralHover}60;
            }
          }
          &:focus {
            color: ${props => props.theme.colors.lightNeutralActive};
            &::placeholder {
              color: ${props => props.theme.colors.lightNeutralActive}60;
            }
          }
      }
    `,
    dark: css`
      & > span {
        color: ${props => props.theme.colors.lightNeutralLight};
          &::placeholder {
            color: ${props => props.theme.colors.lightNeutralLight}60;
          }
          &:hover {
            color: ${props => props.theme.colors.lightNeutralLightHover};
            &::placeholder {
              color: ${props => props.theme.colors.lightNeutralLightHover}60;
            }
          }
          &:focus {
            color: ${props => props.theme.colors.lightNeutralLight};
            &::placeholder {
              color: ${props => props.theme.colors.lightNeutralLightActive}60;
            }
          }
      }
    `
  },
  color: colorPreset
}

export const timePickerPresets = {
  variant: {
    light: css`
      p, svg {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
    `,
    dark: css`
      p, svg {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
    `
  },
  color: colorPreset
}

export const tableHeaderPresets = {
  variant: {
    light: css`
        background-color: ${props => props.theme.colors.lightNeutralLight};
        color: ${props => props.theme.colors.darkNeutralDark};
    `,
    dark: css`
        background-color: ${props => props.theme.colors.lightNeutral};
        color: ${props => props.theme.colors.lightNeutralLight};
    `
  },
  color: colorPreset
}

export const numberPickerPresets = {
  variant: {
    light: css`
      p {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
    `,
    dark: css`
     p {
        color: ${props => props.theme.colors.lightNeutralLight};
     }
    `,
  },
  color: colorPreset
}

export const dateTimePickerPresets = {
  variant: {
    light: css`
      & svg, input, label {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
      & input:hover, div:hover {
        color: ${props => props.theme.colors.darkNeutralDark};
        background: ${props => props.theme.colors.lightNeutralLight};
      }
    `,
    dark: css`
      & svg, input, label {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
      & input:hover, div:hover {
        color: ${props => props.theme.colors.lightNeutralLight};
        background: ${props => props.theme.colors.darkNeutralHover};
      }
    `
  },
  color: colorPreset
}

export const selectWrapperPresets = {
  variant: {
    light: css`
      & .css-1jqq78o-placeholder, .css-13cymwt-control, .css-t3ipsp-control {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
      & div {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
      svg {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
      .css-12a83d4-MultiValueRemove > .css-tj5bde-Svg {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
    `,
    dark: css`
      color: ${props => props.theme.colors.lightNeutralLight};
      & .css-1jqq78o-placeholder, .css-13cymwt-control, .css-t3ipsp-control {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
      div {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
      svg {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
      .css-12a83d4-MultiValueRemove > .css-tj5bde-Svg {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
    `,
  },
  color: colorPreset
}

export const reactSelectWrapperPresets = {
  variant: {
    light: css`
    `,
    dark: css`
    `,
  }
}
// --- Molecules ---

export const taskControlPresets = {
  variant: {
    light: css`
      background-color: ${props => props.theme.colors.lightNeutralLight};
      color: ${props => props.theme.colors.darkNeutral};
      p {
        color: ${props => props.theme.colors.darkNeutral};
      }
      span > p, span > svg {
        color: ${props => props.theme.colors.darkNeutral};
        font-size: ${props => props.theme.fontSizes.medium};
      }
      i {
        background-color: ${props => props.theme.colors.lightNeutralLightActive};
      } 
    `,
    dark: css`
      background-color: ${props => props.theme.colors.darkNeutralDark};
      color: ${props => props.theme.colors.lightNeutralLight};
      p {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
      span > p, span > svg {
        color: ${props => props.theme.colors.lightNeutralLight};
        font-size: ${props => props.theme.fontSizes.medium};
      }
      i {
        background-color: ${props => props.theme.colors.darkNeutralLightActive};
      } 
    `,
  },
  color: colorPreset
}

export const taskRowPresets = {
  variant: {
    light: css`
        background-color: ${props => props.theme.colors.lightNeutralLight};
        color: ${props => props.theme.colors.darkNeutralDark};
        p, svg {
          color: ${props => props.theme.colors.darkNeutralDark};
        }
    `,
    dark: css`
        background-color: ${props => props.theme.colors.lightNeutral};
        color: ${props => props.theme.colors.lightNeutralLight};
        p, svg {
          color: ${props => props.theme.colors.lightNeutralLight};
        }
    `
  },
  status: {
    completed: css`
      td {
        position: relative;
        &::before {
          content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${props => props.theme.colors.success}70;
            z-index: 1;
            pointer-events: none; /* Make the overlay non-interactive */
        }
      }
    `,
    incomplete: css`
        // Added for consistency
        td {
            position: relative;
            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: transparent; /* Semi-transparent yellow */
              z-index: 1;
              pointer-events: none; /* Make the overlay non-interactive */
            }
          }
    `,
    waiting: css`
      td {
        position: relative;
        &::before {
          content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${props => props.theme.colors.warning}70; 
            z-index: 1;
            pointer-events: none; /* Make the overlay non-interactive */
        }
      }
    `,
    inconsistent: css`
      td {
        position: relative;
        &::before {
          content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${props => props.theme.colors.danger}70; 
            z-index: 1;
            pointer-events: none; /* Make the overlay non-interactive */
        }
      }
    `,
  },
  highlight: {
    old: css`
      td {
        position: relative;
        &::before {
          content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${props => props.theme.colors.lightNeutral}70;
            z-index: 1;
            pointer-events: none; /* Make the overlay non-interactive */
        }
      }
      `,
    selected: css`
      outline: 1px solid ${props => props.theme.colors.lightNeutralLight};
  `
  },
  color: colorPreset
}

export const taskTablePresets = {
  variant: {
    light: css`
        background-color: ${props => props.theme.colors.lightNeutralLight};
        color: ${props => props.theme.colors.darkNeutralDark};
        p, svg {
          color: ${props => props.theme.colors.darkNeutralDark};
        }
    `,
    dark: css`
        background-color: ${props => props.theme.colors.lightNeutral};
        color: ${props => props.theme.colors.lightNeutralLight};
        p, svg {
          color: ${props => props.theme.colors.lightNeutralLight};
        }
    `
  },
  color: colorPreset
}

export const paginationPresets = {
  variant: {
    light: css`
      background-color: ${props => props.theme.colors.lightNeutralLight};
      .pagination-icon {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
    `,
    dark: css`
      background-color: ${props => props.theme.colors.darkNeutralDark};
      .pagination-icon {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
    `
  },
  color: colorPreset
}

export const navPresets = {
  variant: {
    light: css`
      h1, a {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
       & .logo {
        background: transparent;
        filter: invert(100%) brightness(0%);
        // see also (convert black to any hex with filter): https://codepen.io/sosuke/pen/Pjoqqp
      }
      & .logo:active {
        filter: invert(100%) brightness(0%) invert(36%) sepia(80%) saturate(3178%) hue-rotate(238deg) brightness(99%) contrast(91%);
      }
    `,
    dark: css`
      h1, a {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
      & .logo {
        background: transparent;
        filter: invert(0%) brightness(100%);
        // see also (convert black to any hex with filter): https://codepen.io/sosuke/pen/Pjoqqp
      }
      & .logo:active {
        filter: invert(100%) brightness(0%) invert(36%) sepia(80%) saturate(3178%) hue-rotate(238deg) brightness(99%) contrast(91%);
      }
    `
  },
  color: colorPreset
}

export const infoSectionPresets = {
  variant: {
    light: css`
      background-color: #fff; // To pass contrast WGAG requirement
			// See also: https://accessibleweb.com/color-contrast-checker/
			// with foreground = #fff, background = #815AF1 (primary) 
      .reverse {
        flex-direction: row-reverse;
      }
      h2 {
        color: ${props => props.theme.colors.primary};
      }
      h1 {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
      p {
        color: ${props => props.theme.colors.darkNeutral};
      }
    `,
    dark: css`
      background-color: ${props => props.theme.colors.darkNeutralDark};

      h2, p {
        color: ${props => props.theme.colors.backgroundTextColor};
      }
    `
  },
}

// ------
// --- Organisms ---

export const taskEditorPresets = {
  variant: {
    light: css`
      h1 {
        color: ${props => props.theme.colors.lightNeutral};
      }
    `,
    dark: css`
      h1 {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
    `
  },
  color: colorPreset
}

export const authFormPresets = {
  variant: {
    light: css`
      color: ${props => props.theme.colors.lightNeutral};
      background-color: ${props => props.theme.colors.lightNeutralLight};
      box-shadow: ${props => props.theme.elevations.small};
      & a {
        color: ${props => props.theme.colors.primary};
      }
      & a:hover {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
      & h2, h3, p, label {
        color: ${props => props.theme.colors.lightNeutral};
      }
      & input {
        box-shadow: ${props => props.theme.elevations.small};
      }
      & section {
        background-color: ${props => props.theme.colors.lightNeutralLightActive};
      }
      & span {
        color: ${props => props.theme.colors.lightNeutral};
      }
      & .logo {
        // darkNeutralDark color
        background: transparent;
        filter: invert(100%) brightness(0%) invert(11%) sepia(7%) saturate(1281%) hue-rotate(245deg) brightness(101%) contrast(89%);
        // see also (convert black to any hex with filter): https://codepen.io/sosuke/pen/Pjoqqp
      }
    `,
    dark: css`
      color: ${props => props.theme.colors.lightNeutralLight};
      background-color: ${props => props.theme.colors.darkNeutralDark};
      box-shadow: ${props => props.theme.elevations.small};
      & a {
        color: ${props => props.theme.colors.primaryLightActive};
      }
      & a:hover {
        color: ${props => props.theme.colors.primaryLightHover};
      }
      & h2, h3, p, label {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
      & input {
        box-shadow: ${props => props.theme.elevations.small};
      }
      & section {
        background-color: ${props => props.theme.colors.lightNeutralLightActive};
      }
      & span {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
    `
  },
  color: colorPreset
}

export const getPresetCSS = (preSets, preSetProp) => props => preSets[preSetProp][props[preSetProp]]

const colors = {
  primaryLight: '#f1ecfd', primaryLightHover: '#e2d9fc', primaryLightActive: '#b7a1f7',
  primary: '#815af1', primaryHover: '#6031ed', primaryActive: '#4112ce',
  primaryDark: '#2f0d96', primaryDarkHover: '#1e085e', primaryDarkActive: '#120538',
  primaryDarker: '#060213',
  darkNeutralLight: '#ebeaeb', darkNeutralLightHover: '#e1e0e1', darkNeutralLightActive: '#c2bfc2',
  darkNeutral: '#39313a', darkNeutralHover: '#332c34', darkNeutralActive: '#2e272e',
  darkNeutralDark: '#2b252c', darkNeutralDarkHover: '#221d23', darkNeutralDarkActive: '#1a161a',
  darkNeutralDarker: '#141114',
  lightNeutralLight: '#eeedee', lightNeutralLightHover: '#e5e3e5', lightNeutralLightActive: '#c9c6c9',
  lightNeutral: '#504651', lightNeutralHover: '#483f49', lightNeutralActive: '#403841',
  lightNeutralDark: '#3c353d', lightNeutralDarkHover: '#302a31', lightNeutralDarkActive: '#241f24',
  lightNeutralDarker: '#1c191c',
  dangerLight: '#fbecec', dangerLightHover: '#f9becec', dangerLightActive: '#f2c5c5',
  danger: '#d64444', dangerHover: '#c13d3d', dangerActive: '#ab3636',
  dangerDark: '#a13333', dangerDarkHover: '#802929', dangerDarkActive: '#601f1f',
  dangerDarker: '#4b1818',
  successLight: '#f2fcf1', successLightHover: '#ecfaea', successLightActive: '#d8f5d3',
  success: '#80de71', successHover: '#73c866', successActive: '#66b25a',
  successDark: '#60a755', successDarkHover: '#4d8544', successDarkActive: '#3a6433',
  successDarker: '#2d4e28',
  warningLight: '#fdf8f2', warningLightHover: '#fcf5eb', warningLightActive: '#f8ead5',
  warning: '#e8bb79', warningHover: '#d1a86d', warningActive: '#ba9661',
  warningDark: '#ae8c5b', warningDarkHover: '#8b7049', warningDarkActive: '#685436',
  warningDarker: '#51412a',
  body: '#39313a', defaultFontColor: '#f4f0ff'
}
const theme = { colors, fontSizes, breakpoints, spaces, elevations, insets }
export default theme