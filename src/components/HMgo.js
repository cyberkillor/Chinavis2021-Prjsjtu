import {Link} from 'react-router-dom'

const HMgo = () => {
    return (
        <div>
            <div id="pollutant_btn">
                <span>Select the pollutant:</span>
            </div>
            <br />
            <div id="month_btn">
                <span>Select the month:</span>
            </div>
            <br />
            <div id="day_btn">
                <span>Select the day:</span>
            </div>

            <Link to='/'>Back to Main Page</Link>
        </div>
    )
}
export default HMgo