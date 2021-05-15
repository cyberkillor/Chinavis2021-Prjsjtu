import React from "react";
import {Link} from 'react-router-dom'
import image_1 from '../img/1.jpg'
import image_2 from '../img/2.jpg'
import image_3 from '../img/3.jpg'
import image_4 from '../img/4.jpg'
import image_5 from '../img/5.jpg'
import "../css/index.css"

class Cover extends React.Component {
    render() {
        return (
            <div>
                <div className='cover-body'>
                    <div className="cover-container">
                        <ul>
                            <li><img src={image_1} alt={1}/></li>
                            <li><img src={image_2} alt={2}/></li>
                            <li><img src={image_3} alt={3}/></li>
                            <li><img src={image_4} alt={4}/></li>
                            <li><img src={image_5} alt={5}/></li>
                            <li className="bigImg" />
                            <li className="frame" />
                        </ul>
                    </div>
                    <br />
                    <Link to='/main' id='main-go'> Go Main</Link>
                </div>
            </div>
        )
    }
}

export default Cover