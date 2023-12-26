import React from 'react'
import { NextButtonStyled } from './NextButton.elements'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import theme from '../../../styles/theme.js'
import PropTypes from 'prop-types'

function NextButton({ variant, size, color, children, ...rest }) {
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

NextButton.propTypes = {
	variant: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	color: PropTypes.string,
	children: PropTypes.node,
}

function calculateSize(sizePx) { return parseFloat(sizePx.match(/\d+/)[0]) }

function letterToSize(sizeChar = 'l') {
	const validSizes = {
		'xs': theme.spaces.smaller,
		's': theme.spaces.small,
		'm': theme.spaces.medium, // 16px
		'l': theme.spaces.large, // 32px
		'xl': theme.spaces.larger,
		'xxl': theme.spaces.extraLarge,
	}
	return calculateSize(validSizes[sizeChar] || '32px')
}

export default NextButton