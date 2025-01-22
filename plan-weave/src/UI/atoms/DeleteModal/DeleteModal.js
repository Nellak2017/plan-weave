import Button from '../Button/Button.js'

const modalStyles = { // Styles here because it is so basic, no styled components needed
	container: { maxWidth: '254px', backgroundColor: '#fff', },
	text: { color: 'black', },
	buttonContainer: { display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', },
}
const DeleteModal = ({ // services = {deleteMany, highlighting}
	services,
	userId,
	selectedTasks,
	taskList,
	warningText = 'Warning, you are deleting multiple tasks. Are you sure?',
	options = ['Yes', 'No'],
	setIsDeleteClicked = (_) => console.warn('No setIsDeleteClicked defined for DeleteModal'),
	closeToast = () => console.warn('No closeToast defined for DeleteModal')
}) => (
	<div style={modalStyles.container}>
		<p style={modalStyles.text}>{warningText}</p>
		<div style={modalStyles.buttonContainer}>
			<Button variant={'delete'} onClick={() => {
				const selectedIds = selectedTasks?.map((selected, index) =>
					selected
						? taskList[index]?.id // it should have id, but ? to be safe
						: selected)
					.filter(selected => typeof selected !== 'boolean')
				services?.deleteMany(selectedIds, userId)
				services?.highlighting()
				closeToast()
			}}>
				{options[0]}
			</Button>
			<Button variant={'newTask'} onClick={() => {
				setIsDeleteClicked(false)
				closeToast()
			}}>
				{options[1]}
			</Button>
		</div>
	</div>
)
export default DeleteModal