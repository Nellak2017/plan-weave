import React from 'react'
import { TableHeaderContainer, StyledRow } from './TableHeader.elements'

const TableHeader = ({ variant, labels }) => {
	return (
		<thead>
			<StyledRow variant={variant}>
				<th></th>
				<th></th>
				{labels.map((label, index) => (
					<TableHeaderContainer variant={variant} key={index}>
						{label}
					</TableHeaderContainer>
				))}
				<th></th>
			</StyledRow>
		</thead>
	)
}

export default TableHeader