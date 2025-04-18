import { Link } from 'react-router-dom'
import '../Footer.css'

export const Footer = () => {
    return (
        <footer className="footer">
            <section className="footer-columns">
                <section className="footer-news">
                    <h1>News</h1>
                    <Link to='/search/coding?p=1'>
                        <p>Coding</p>
                    </Link>
                    <Link to='/search/football?p=1'>
                        <p>Football</p>
                    </Link>
                    <Link to='/search/cooking?p=1'>
                        <p>Cooking</p>
                    </Link>
                </section>
                <section className="footer-support">
                    <h1>Support</h1>
                    <p>About Us</p>
                    <p>Contact Us</p>
                    <p>Careers</p>
                </section>
                <section className="footer-services">
                    <h1>Services</h1>
                    <p>Advertise with NC News</p>
                    <p>Follow NC News on X</p>
                </section>
            </section>
            <p>Copyright <i className="fa-regular fa-copyright"></i> 2025 Northcoders News</p>
            <p>This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders</p>
        </footer>
    )
}