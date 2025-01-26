import { Button } from "@mui/material"

const modalStyles = { container: { maxWidth: '254px', backgroundColor: '#fff', }, text: { color: 'black', }, buttonContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', }, }
const DeleteModal = ({
	state: { userId = 0, selectedTasks = [], taskList = [], warningText = 'Warning, you are deleting multiple tasks. Are you sure?', options = ['Yes', 'No'], } = {},
	services: { deleteMany = (_, __) => console.warn('deleteMany not implemented for DeleteModal'), highlighting = () => console.warn('highlighting not implemented for DeleteModal'), setIsDeleteClicked = (_) => console.warn('setIsDeleteClicked not implemented for DeleteModal'), closeToast = () => console.warn('closeToast not implemented for DeleteModal') } = {}
}) => (
	<div style={modalStyles.container}>
		<p style={modalStyles.text}>{warningText}</p>
		<div style={modalStyles.buttonContainer}>
			<Button variant={'delete'} onClick={() => {
				const selectedIds = selectedTasks?.map((selected, index) => selected ? taskList?.[index]?.id : selected)?.filter(selected => typeof selected !== 'boolean')
				deleteMany(selectedIds, userId); highlighting(); closeToast()
			}}>
				{options?.[0]}
			</Button>
			<Button variant={'newTask'} onClick={() => { setIsDeleteClicked(false); closeToast() }}>
				{options?.[1]}
			</Button>
		</div>
	</div>
)
export default DeleteModal