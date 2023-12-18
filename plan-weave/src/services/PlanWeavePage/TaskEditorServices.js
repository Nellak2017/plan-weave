import { updateSearch } from "../../redux/reducers/taskEditorReducer"

export const createTaskEditorServices = (store) => {

	const dispatch = store.dispatch

	const services = {
		taskControl: {
		  search: (newSearchValue) => {
			dispatch(updateSearch(newSearchValue.trim()))
		  }, // reducer for updating search in the store associated with that section
		  /* 
		  start: // thunk to update start
		  end: // thunk to update end
		  owl: // thunk to update owl
		  addTask: // thunk to add task
		  deleteMany: // thunk to delete many
		  sort: // thunk to update sorting method
		},
		taskTable: {
		  dragNdrop: // reducer to update store when drag and drop happens (not DB)
		  taskRow: {
			delete: // thunk to delete task
			update: // thunk to update task, includes checkbox, name, ttc
		  },
		},
		pagination: {
		  refresh: // thunk to apply refresh logic to all tasks
		  currentPage: // reducer to change displayed page, initially 1 always
		  tasksPerPage: // thunk to change tasks per page, initially 10 unless defined otherwise by DB
		*/
		},
	  }

	  return services
}
