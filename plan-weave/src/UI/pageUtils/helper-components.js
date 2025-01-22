import Spinner from '../atoms/Spinner/Spinner.js' 

// --- Loading or Error
export const loadingOrError = ({ loading, error, user, spinnerComponent }) => {
	if (loading) return (spinnerComponent || <Spinner />)
	if (error) return <p>{error.message || 'Error malformed or missing message property'}</p>
	if (!user) {
		return (
			<div>
				<h1>Unauthorized</h1>
				<p>You need to log in to access this page.</p>
			</div>
		)
	} 
}