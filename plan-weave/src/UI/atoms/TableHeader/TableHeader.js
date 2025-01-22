import { TableHeaderContainer, StyledRow } from './TableHeader.elements'
import { VARIANTS } from '../../../Core/utils/constants.js'

const TableHeader = ({ variant = VARIANTS[0], labels }) => (
	<thead>
		<StyledRow variant={variant}>
			<th></th>
			<th></th>
			{labels.map((label, index) => (<TableHeaderContainer variant={variant} key={label || `Unique Key: ${index}`}>{label}</TableHeaderContainer>))}
			<th></th>
		</StyledRow>
	</thead>
)
export default TableHeader