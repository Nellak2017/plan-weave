import { TableHeaderContainer, StyledRow } from './TableHeader.elements'
import { THEMES } from '../../utils/constants'

const TableHeader = ({ variant, labels }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'
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