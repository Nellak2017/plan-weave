import Spinner from '../Spinner/Spinner.js' 
export const LoadingOrError = ({ loading, error, user, spinnerComponent }) => {
    if (loading) return (spinnerComponent || <Spinner />)
    if (error) return <p>{error.message || 'Error malformed or missing message property'}</p>
    if (!user) {return (<div> <h1>Unauthorized</h1> <p>You need to log in to access this page.</p></div>)} 
}