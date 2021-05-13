import PropTypes from 'prop-types'
import {useLocation} from 'react-router-dom'
import Button from './Button'

const Header = (props) => {
    const location = useLocation()

    return (
        <header className='header'>
            <h1>
                {props.title}
            </h1>
            {location.pathname === '/' && <Button
                color={props.showAdd ? 'red':'green'}
                text={props.showAdd ? 'CLOSE' : 'ADD'}
                onClick={props.onAdd}
            />}
        </header>
    )
}

// CSS in JS
// style={headingStyle}
// const headingStyle = {
//     color: 'red',
//     backgroundColor: 'black',
// }

Header.defaultProps = {
    title: "Choose Bar",
}

Header.prototype = {
    title: PropTypes.string,    // .isRequired
}

export default Header