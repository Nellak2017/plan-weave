import { TableHeaderContainer, StyledRow } from './TableHeader.elements'

export const TableHeader = ({ labels }) => (
	<thead>
		<StyledRow>
			<th /><th /><th />
			{labels.map((label, index) => (<TableHeaderContainer key={label || `Unique Key: ${index}`}>{label}</TableHeaderContainer>))}
			<th />
		</StyledRow>
	</thead>
)
export default TableHeader