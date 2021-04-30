import React, { useState, useEffect, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from "../photos/logo.png"
import { AdminContext } from './../App';

const Header2 = () => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark">
            <div className="container">
                <NavLink className="navbar-brand" to="/admin/login">
                    <img src={Logo} alt="Logo" className="logo" />
                </NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/admin/login" activeClassName="active" className="nav-link">Home</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

const sideNavLinks = [
    {
        name: "Dashboard",
        path: ""
    },
    {
        name: "My Profile",
        path: "profile"
    },
    {
        name: "Admins",
        path: "admins"
    }
]

const SideNav = () => {
    return (
        <div className="col-8 col-sm-6 d-none d-md-block col-md-3 col-lg-3 col-xl-1 sidenav theme">
            <ul>
                {
                    sideNavLinks.map((link, key) => {
                        return (
                            <li key={key}>
                                <Link to={`/admin/${link.path}`}>{link.name}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const Header = () => {
    const [adminData, setAdminData] = useState({ name: "", email: "" })

    const { data } = useContext(AdminContext)
    useEffect(() => {
        setAdminData({ name: data.name, email: data.email })
    }, [data])
    return (
        <>
            <div className="theme d-flex flex-column header">

                <div className="ms-auto">
                    <Link to="/admin/profile" className="fas fa-user-circle text-light text-decoration-none">&nbsp;{adminData.name}</Link>&nbsp;
            <Link to="/admin/logout" className="fas fa-sign-out-alt text-danger text-decoration-none"></Link>
                </div>
            </div>
        </>
    )
}

export default Header
export { SideNav }