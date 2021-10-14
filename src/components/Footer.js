import { Link } from "react-router-dom";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer>
            <p>Copyright &copy; {year}</p>
            <Link to='/about'>About</Link>
        </footer>
    )
}

export default Footer
