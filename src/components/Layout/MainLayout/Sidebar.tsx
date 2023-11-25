import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faUser} from '@fortawesome/free-solid-svg-icons'
import {Link, useLocation} from "react-router-dom";
import clsx from "clsx";

const linkList = [
    {link: "/users", icon: faUser},
    {link: "/messages", icon: faEnvelope},
]

export const Sidebar = () => {
    const location = useLocation()

    return (<div className="position-absolute top-0 bottom-0 left-0" style={{backgroundColor: 'red'}}>
            <div className="d-flex flex-column flex-shrink-0 bg-light" style={{width: '4.5rem', height: '100%'}}>
                <ul className="nav nav-pills flex-column mb-auto text-center">
                    {linkList.map(item =>
                        <li className="nav-item" key={item.link}>
                            <div className={clsx(
                                "d-flex align-items-center justify-content-center nav-link m-1",
                                location.pathname === item.link && "active"
                            )} style={{minHeight: '60px'}}>
                                <Link to={item.link}>
                                    <FontAwesomeIcon icon={item.icon} size="2xl"
                                                     style={location.pathname === item.link ? {color: '#FFFFFF'} : {}}/>
                                </Link>
                            </div>

                        </li>)}


                </ul>
                <div className="dropdown border-top">
                    <a href="#"
                       className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle"
                       id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://github.com/mdo.png" alt="mdo" width="24" height="24"
                             className="rounded-circle"/>
                    </a>
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
                        <li><a className="dropdown-item" href="#">New project...</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li>
                            <hr className="dropdown-divider"/>
                        </li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}