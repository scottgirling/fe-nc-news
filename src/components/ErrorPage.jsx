import { Link } from 'react-router-dom';
import '../ErrorPage.css';

export const ErrorPage = ({ errorFindingArticle, errorFindingTopic }) => {
    return (
        <>
            
            <main className="error-main">
                <h2 className="error-number">404</h2>
                {errorFindingArticle || errorFindingTopic ? (
                    <h2 className="not-found">{errorFindingArticle || errorFindingTopic.replace(".", "")}</h2>
                ) : (
                    <h2 className="not-found">Page not found</h2>
                )}
                <p className="exclamation-mark"><i className="fa-solid fa-circle-exclamation"></i></p>
                <p>Sorry, we're unable to bring you the page you're looking for. Please try:</p>
                <ul className="error-ul">
                    <li>Double checking the URL</li>
                    <li>Hitting the refresh button in your browser</li>
                </ul>
                <p>Alternatively, please visit the <Link to="/"> <span className="nc-news">Northcoders News homepage.</span></Link></p>
            </main>
        </>
    )
}