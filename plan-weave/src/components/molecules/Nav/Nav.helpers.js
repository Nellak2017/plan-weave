import Link from 'next/link'

// Uses App as default
export const makeLink = ({
	text = 'App',
	link = '/plan-weave',
	title = 'Go to Plan Weave App',
	label = 'Go to Plan Weave App',
	handler,
	index = 0,
	...props
}) => (
	<Link
		href={link}
		title={title}
		role={'link'}
		aria-label={label}
		onClick={handler}
		onKeyDown={e => { if (e.key === 'Enter') { if (handler){handler()} } }}
		tabIndex={index}
		{...props}
	>
		{text}
	</Link>
)

export const defaultLogin = ({
	text = 'Log in',
	link = '/login',
	title = 'Log in',
	label = 'Log in to Plan-Weave',
	handler,
	index = 0,
	...props
}) => (makeLink({text, link, title, label, handler, index, ...props}))