import {Link} from 'react-router-dom'

const HMgo = () => {
    return (
        <div>
            <span>Select the pollutant:</span>
            <div id="pollutant_btn">
            </div>
            <br />
            <span>Select the month:</span>
            <div id="month_btn">
            </div>
            <br />
            <span>Select the day:</span>
            <div id="day_btn">
            </div>

            <Link to='/'>Back to Main Page</Link>
        </div>
    )
}
export default HMgo