import { toast } from 'react-toastify'
import { handleLogout } from "../../pageUtils/page-handlers"
import { makeLink } from '../../components/molecules/Nav/Nav.helpers'

export const options = [
	{ name: 'name', listener: () => toast.info('Name Sorting applied. Tasks now appear alphabetically.'), algorithm: 'name' },
	{ name: 'time created', listener: () => toast.info('Time Sorting applied. Tasks now appear in chronological order.'), algorithm: 'timestamp' },
	{ name: 'ETA', listener: () => toast.info('ETA Sorting applied. Tasks now appear in ETA order.'), algorithm: 'eta' },
	{ name: 'default', listener: () => toast.info('Default Sorting applied. Tasks now appear as they do in the database.'), algorithm: '' },
]

export const title = () => <h1 style={{ fontSize: '40px' }}>App</h1>

export const defaultLogout = ({
	text = 'Log Out',
	link = '/',
	title = 'Log Out',
	label = 'Log Out of Plan-Weave',
	handler = handleLogout,
	index = 4
}) => (makeLink({ text, link, title, label, handler, index }))