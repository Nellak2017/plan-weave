import { TableHeaderContainer, StyledRow } from './TableHeader.elements'
import { THEMES } from '../../utils/constants'
import PropTypes from 'prop-types'

const TableHeader = ({ variant, labels }) => {
	if (variant && !THEMES.includes(variant)) variant = 'dark'
	return (
		<thead>
			<StyledRow variant={variant}>
				<th></th>
				<th></th>
				{labels.map((label, index) => (
					<TableHeaderContainer variant={variant} key={label || `Unique Key: ${index}`}>
						{label}
					</TableHeaderContainer>
				))}
				<th></th>
			</StyledRow>
		</thead>
	)
}

TableHeader.propTypes = {
	variant: PropTypes.string,
	labels: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default TableHeader