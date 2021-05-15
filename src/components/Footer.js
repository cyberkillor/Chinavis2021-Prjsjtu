import {Link} from 'react-router-dom'
import {Route} from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <p>Chinavis &copy; 2021</p>
            <Route path='/main'>
                <Link to='/main/heatMap'>HeatMap</Link>
            </Route>
            <br />
            <Link to="/main/about">About</Link>
        </footer>
    )
}
export default Footer