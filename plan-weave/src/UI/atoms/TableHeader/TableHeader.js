import React from 'react'
import { TableHeaderContainer, StyledRow } from './TableHeader.elements'
import { THEMES, VARIANTS } from '../../utils/constants'
import PropTypes from 'prop-types'

const TableHeader = ({ variant = VARIANTS[0], labels }) => {
	const processedVariant = variant && !THEMES.includes(variant) ? VARIANTS[0] : variant
	return (
		<thead>
			<StyledRow variant={processedVariant}>
				<th></th>
				<th></th>
				{labels.map((label, index) => (
					<TableHeaderContainer variant={processedVariant} key={label || `Unique Key: ${index}`}>
						{label}
					</TableHeaderContainer>
				))}
				<th></th>
			</StyledRow>
		</thead>
	)
}

TableHeader.propTypes = {
	variant: PropTypes.oneOf(VARIANTS),
	labels: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default TableHeader