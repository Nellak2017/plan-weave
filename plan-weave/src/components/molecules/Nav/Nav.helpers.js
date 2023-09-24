import Link from 'next/link'

// Uses App as default
export const makeLink = ({
	text = 'App',
	link = '/plan-weave',
	title = 'Go to Plan Weave App',
	label = 'Go to Plan Weave App',
	handler,
	index = 3,
}) => (
	<Link
		href={link}
		title={title}
		role={'link'}
		aria-label={label}
		onClick={handler}
		onKeyDown={e => { if (e.key === 'Enter') { if (handler){handler()} } }}
		tabIndex={index}
	>
		{text}
	</Link>
)

export const defaultLogin = ({
	text = 'Log in',
	link = '/login',
	title = 'Log in',
	label = 'Login to Plan-Weave',
	handler,
	index = 4
}) => (makeLink({text, link, title, label, handler, index}))