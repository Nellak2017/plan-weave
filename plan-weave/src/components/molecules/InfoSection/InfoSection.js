import React from 'react'
import homeImgOne from '../../../../public/Home-Page/svg-1-task-computer.svg'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../../atoms/Button/Button'
import {
	StyledInfoContainer,
	ColumnContainer,
	Column,
	TextContainer,
} from './InfoSection.elements.js'
import PropTypes from 'prop-types'

const defaultData = {
	topLine: 'Plan Weave',
	headline: 'Focus on what is important',
	description: 'From the simplest task to the busiest calendar, Plan Weave lets you see what you need to do by organizing tasks so you know what you are doing, why you are doing it, and how to do it.',
	buttonLabel: 'Get Started',
	img: homeImgOne,
	alt: 'Task SVG',
}

/* 
Source of All SVGs used for picture purposes: https://undraw.co/
Source of All SVGs used for logo purposes: https://react-icons.github.io/react-icons/
*/

// Displays Text on the left or right and an image on the other side
// if Dark then img on right, if Light then img on left (simplified)
// className "reverse" only works if it is light theme
function InfoSection({
	variant = 'dark', // img right if dark, img left if light
	width = 555, height = 307, // dimensions of image
	data = defaultData
}) {
	return (
		<StyledInfoContainer variant={variant}>
			<ColumnContainer className="reverse">
				<Column>
					<TextContainer>
						<h2>{data?.topLine}</h2>
						<h1>{data?.headline}</h1>
						<p>{data?.description}</p>
						<Link href="/signup">
							<Button>
								{data?.buttonLabel}
							</Button>
						</Link>
					</TextContainer>
				</Column>
				<Column>
					<Image
						src={data?.img?.src}
						alt={data?.alt || 'Image for Section'}
						width={width || 555}
						height={height || 307}
						style={{
							width: '100%',
							height: 'auto',
						}}
						title={data?.topLine || 'Image not found'}
						priority={true}
					/>
				</Column>
			</ColumnContainer>
		</StyledInfoContainer>
	)
}

InfoSection.propTypes = {
	variant: PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number,
	data: PropTypes.shape({
		topLine: PropTypes.string,
		headline: PropTypes.string,
		description: PropTypes.string,
		buttonLabel: PropTypes.string,
		img: PropTypes.shape({
			src: PropTypes.string,
			alt: PropTypes.string,
		}),
	}),
}

export default InfoSection