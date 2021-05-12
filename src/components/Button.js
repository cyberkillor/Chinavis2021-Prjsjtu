import PropTypes from 'prop-types'
const Button = ({color, text, onClick}) => {
    return (
        <div>
            <button
                className='btn'
                style={{backgroundColor: color}}
                onClick={onClick}
            >
                {text}
            </button>
        </div>
    )
}

Button.defaultProps = {
    color: 'steelblue',
}

Button.prototype = {
    color: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
}

export default Button