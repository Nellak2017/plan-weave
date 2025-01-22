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
const colorVariant = ({ color, bg, hover, active }) => css`
  color: ${color};
  background-color: ${bg};
  &:hover { background-color: ${hover};}
  &:active { background-color: ${active};}
`
export const colorPreset = {
  primary: colorVariant({ color: props => props.theme.colors.primaryLight, bg: props => props.theme.colors.primary, hover: props => props.theme.colors.primaryHover, active: props => props.theme.colors.primaryActive}),
  darkNeutral: colorVariant({ color: props => props.theme.colors.darkNeutralLight, bg: props => props.theme.colors.darkNeutral, hover: props => props.theme.colors.darkNeutralHover, active: props => props.theme.colors.darkNeutralActive}),
  lightNeutral: colorVariant({ color: props => props.theme.colors.lightNeutralLight, bg: props => props.theme.colors.lightNeutral, hover: props => props.theme.colors.lightNeutralHover, active: props => props.theme.colors.lightNeutralActive}),
  danger: colorVariant({ color: props => props.theme.colors.dangerLight, bg: props => props.theme.colors.danger, hover: props => props.theme.colors.dangerHover, active: props => props.theme.colors.dangerActive}),
  success: colorVariant({ color: props => props.theme.colors.successLight, bg: props => props.theme.colors.success, hover: props => props.theme.colors.successHover, active: props => props.theme.colors.successActive}),
  warning: colorVariant({ color: props => props.theme.colors.warningLight, bg: props => props.theme.colors.warning, hover: props => props.theme.colors.warningHover, active: props => props.theme.colors.warningActive}),
  transparent: css`
    color: #fff;
    background-color: transparent;
    &:hover { background-color: transparent;}
    &:active { background-color: transparent;}
  `
}
const taskInputOverlay = ({ color, placeholderColor }) => css`
	color: ${color};
	&::placeholder { color: ${placeholderColor}60;}
`
const taskInputVariantStyles = ({ color, hoverColor, focusColor, focusPlaceholderColor }) => css`
	& > span {
		color: ${color};
		&::placeholder { color: ${color}60;}
		&:hover { ${taskInputOverlay({ color: hoverColor, placeholderColor: hoverColor })}}
		&:focus { ${taskInputOverlay({ color: focusColor, placeholderColor: focusPlaceholderColor })}}
	}
`
export const taskInputPreSets = {
  variant: {
    light: taskInputVariantStyles({
      color: props => props.theme.colors.lightNeutral,
      hoverColor: props => props.theme.colors.lightNeutralHover,
      focusColor: props => props.theme.colors.lightNeutralActive,
      focusPlaceholderColor: props => props.theme.colors.lightNeutralActive,
    }),
    dark: taskInputVariantStyles({
      color: props => props.theme.colors.lightNeutralLight,
      hoverColor: props => props.theme.colors.lightNeutralLightHover,
      focusColor: props => props.theme.colors.lightNeutralLight,
      focusPlaceholderColor: props => props.theme.colors.lightNeutralLightActive,
    }),
  },
  color: colorPreset,
}
export const selectWrapperPresets = {
  variant: {
    light: css`
      & .css-1jqq78o-placeholder, .css-13cymwt-control, .css-t3ipsp-control, div, svg, .css-12a83d4-MultiValueRemove > .css-tj5bde-Svg {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
    `,
    dark: css`
      color: ${props => props.theme.colors.lightNeutralLight};
      & .css-1jqq78o-placeholder, .css-13cymwt-control, .css-t3ipsp-control, svg {
        color: ${props => props.theme.colors.lightNeutralLight};
      }
      div, .css-12a83d4-MultiValueRemove > .css-tj5bde-Svg {
        color: ${props => props.theme.colors.darkNeutralDark};
      }
    `,
  },
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