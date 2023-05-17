import React from 'react'
import { NextButtonStyled } from './NextButton.elements'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import theme from '../../../styles/theme.js'

function NextButton(props) {
	const { variant, size, color, children, ...rest } = props
	const sizeOfIcon = letterToSize(size) // ex: 'm' -> 16, 'l' -> 32 
	return (
		<NextButtonStyled variant={variant} size={typeof size != 'string' ? 'l' : size} color={color} {...rest}>
			{variant === 'left' ?
				<BiChevronLeft size={sizeOfIcon} /> :
				<BiChevronRight size={sizeOfIcon} />
			}
		</NextButtonStyled>
	)
}

function calculateSize(sizePx) { return parseFloat(sizePx.match(/\d+/)[0]) }

function letterToSize(sizeChar = 'l') {
	let sizePx
	switch (sizeChar) {
		case 'xs':
			sizePx = theme.spaces.smaller
			break
		case 's':
			sizePx = theme.spaces.small
			break
		case 'm':
			sizePx = theme.spaces.medium // 16px
			break
		case 'l':
			sizePx = theme.spaces.large // 32px
			break
		case 'xl':
			sizePx = theme.spaces.larger
			break
		case 'xxl':
			sizePx = theme.spaces.extraLarge
			break
		default:
			// Handle invalid size characters here
			sizePx = '32px'
			break
	}

	return calculateSize(sizePx)
}

export default NextButton