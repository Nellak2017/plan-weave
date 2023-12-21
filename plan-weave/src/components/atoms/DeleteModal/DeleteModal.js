import Button from '../Button/Button.js'

// Styles here because it is so basic, no styled components needed
const modalStyles = {
	container: {
		maxWidth: '254px',
		backgroundColor: '#fff',
	},
	text: {
		color: 'black',
	},
	buttonContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
}

// services = {deleteMany, highlighting}
const DeleteModal = ({
	services,
	selectedTasks,
	taskList,
	warningText = 'Warning, you are deleting multiple tasks. Are you sure?',
	options = ['Yes', 'No'],
	setIsHighlighting = (_) => console.warn('No setIsHighlighting defined for DeleteModal'),
	setIsDeleteClicked = (_) => console.warn('No setIsDeleteClicked defined for DeleteModal'),
	closeToast = () => console.warn('No closeToast defined for DeleteModal')
}) => {
	return (
		<div style={modalStyles.container}>
			<p style={modalStyles.text}>{warningText}</p>
			<div style={modalStyles.buttonContainer}>
				<Button variant={'delete'} onClick={() => {
					const selectedIds = selectedTasks?.map((selected, index) =>
						selected
							? taskList[index]?.id // it should have id, but ? to be safe
							: selected)
						.filter(selected => typeof selected !== 'boolean')
					services?.deleteMany(selectedIds)
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
}

export default DeleteModal