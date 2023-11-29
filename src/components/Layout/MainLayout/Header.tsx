import {Link, useNavigate} from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();

    return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <Link to="/">
                <div className="navbar-brand">Navbar</div>
            </Link>
            <button className="btn btn-primary mx-3" onClick={() => navigate('/auth/login')}>Login</button>
        </div>
    </nav>)
}