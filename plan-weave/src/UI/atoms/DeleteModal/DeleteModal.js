import { Button } from "@mui/material"

const modalStyles = { container: { maxWidth: '254px', backgroundColor: '#fff', }, text: { color: 'black', }, buttonContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', }, }
const DeleteModal = ({
	state: { warningText = 'Warning, you are deleting multiple tasks. Are you sure?', options = [{ label: 'Yes', variant: 'delete' }, { label: 'No', variant: 'newTask' }], } = {}, // userId = 0, selectedTasks = [], taskList = [], 
	services: { optionHandlers = [() => console.warn('Event for yes not implemented'), () => console.warn('Event for no not implemented')], closeToast = () => console.warn('Toast should have closing function provided in DeleteModal') } = {}
}) => (
	<div style={modalStyles.container}>
		<p style={modalStyles.text}>{warningText}</p>
		<div style={modalStyles.buttonContainer}>
			{/* <Button variant={'delete'} onClick={() => {
				const selectedIds = selectedTasks?.map((selected, index) => selected ? taskList?.[index]?.id : selected)?.filter(selected => typeof selected !== 'boolean')
				deleteMany(selectedIds, userId); highlighting(); closeToast()
			}}>
				{options?.[0]}
			</Button>
			<Button variant={'newTask'} onClick={() => { setIsDeleteClicked(false); closeToast() }}>
				{options?.[1]}
			</Button> */}
			{options.map((option, i) => (
				<Button key={option?.label} variant={option?.variant} onClick={() => { optionHandlers?.[i](); closeToast() }}>
					{option?.label}
				</Button>
			))}
		</div>
	</div>
)
export default DeleteModal