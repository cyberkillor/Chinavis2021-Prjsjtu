import {Link} from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <p>Chinavis &copy; 2021</p>
            <Link to='/heatMap'>HeatMap</Link>
            <br />
            <Link to="/about">About</Link>
        </footer>
    )
}
export default Footer