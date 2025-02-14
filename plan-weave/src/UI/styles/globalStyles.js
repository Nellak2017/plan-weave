import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle` // This provides default global CSS that is as minimal and as reasonable as possible
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    ::-moz-selection { /* Code for Firefox */
        color: ${props => props.theme.colors.lightNeutralLight};
        background: ${props => props.theme.colors.primary};
    }
    ::selection {
        color: ${props => props.theme.colors.lightNeutralLight};
        background: ${props => props.theme.colors.primary};
    }
}
a { text-decoration: none;}
body {
    padding: 0!important;
    margin: 0!important;
    background-color: ${props => props.theme.colors.body};
    color: ${props => props.theme.colors.defaultFontColor};
    overflow-x: hidden; // To ensure no weird horizontal scrollbar on homescreen (TODO: Test on other screens)
}
*::-webkit-scrollbar { width: 1em; }
*::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);}
*::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
p, input, button, li, a, span { color: ${props => props.theme.colors.defaultFontColor};}
input, li, a :hover{ // span, p removed because it looks cringe
    color: ${props => props.theme.colors.defaultFontColor};
    box-shadow: ${props => props.theme.elevations.small};
}
button { // appears like a medium sized, primary, standard button by default
    background-color: ${props => props.theme.colors.primary}; // color
    padding: ${props => props.theme.spaces.small} ${props => props.theme.spaces.medium}; // size
    border-radius: ${props => props.theme.spaces.small}; // standard button 
    outline: none;
    border: 0px solid transparent;
}
button:hover { // works for a primary, pill button by default
    background-color: ${props => props.theme.colors.primaryHover};
    box-shadow: ${props => props.theme.elevations.extraSmall};
    cursor: pointer;
}
input { // appears like square bar container by default (Message Input)
    background-color: ${props => props.theme.colors.lightNeutral};
    border-radius: ${props => props.theme.spaces.medium};
    padding: ${props => props.theme.spaces.medium};
    color: ${props => props.theme.colors.defaultFontColor};
    outline: none;
    border: 0px solid transparent;
}
input:hover { background-color: ${props => props.theme.colors.lightNeutralHover}; }
.icon { // basic icon uses default font colors
    padding: 0;
    margin: 0;
    color: ${props => props.theme.colors.defaultFontColor};
}
.icon:hover {
    transition: 350ms;
    color: ${props => props.theme.colors.primaryLightHover} !important;
    cursor: pointer;
}
`
export default GlobalStyle