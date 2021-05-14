import {Link} from 'react-router-dom'
import {Route} from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <p>Chinavis &copy; 2021</p>
            <Route path='/'>
                <Link to='/heatMap'>HeatMap</Link>
            </Route>
            <br />
            <Link to="/about">About</Link>
        </footer>
    )
}
export default Footer