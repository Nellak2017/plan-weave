import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@mui/material"
import { StyledInfoContainer, ColumnContainer, Column, TextContainer, } from './InfoSection.elements.js'
import { VARIANTS } from '../../../Core/utils/constants.js'

// Source of All SVGs used for picture purposes: https://undraw.co/. Source of All SVGs used for logo purposes: https://react-icons.github.io/react-icons/
// img right if dark, img left if light. Displays Text on the left or right and an image on the other side. if Dark then img on right, if Light then img on left (simplified). className "reverse" only works if it is light theme
export const InfoSection = ({ state: { variant = VARIANTS[0], data, priority = true, imageDimensions: { width = 555, height = 307, } = {}, } = {} }) => (
	<StyledInfoContainer variant={variant}>
		<ColumnContainer className="reverse">
			<Column>
				<TextContainer>
					<h2>{data?.topLine}</h2>
					<h1>{data?.headline}</h1>
					<p>{data?.description}</p>
					<Link href="/signup"><Button>{data?.buttonLabel}</Button></Link>
				</TextContainer>
			</Column>
			<Column>
				<Image
					src={data?.img?.src} alt={data?.alt || 'Image for Section'}
					width={width || 555} height={height || 307}
					style={{ width: '100%', height: 'auto', }} title={data?.topLine || 'Image not found'}
					priority={priority} placeholder="blur" blurDataURL="URL"
				/>
			</Column>
		</ColumnContainer>
	</StyledInfoContainer>
)
export default InfoSection