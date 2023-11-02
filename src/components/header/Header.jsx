import React from 'react'
import { BiLogIn } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import "./Header.scss"
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RESET, logout, } from '../../redux/features/auth/authSlice';
import { ShowOnLogin, ShowOnLogout } from '../protect/hiddenLink';
import { UserName } from '../../pages/profile/Profile';

const activeLink = ({ isActive }) => (isActive ? "active" : "")

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/")
    }

    const logoutUser = async () => {
        dispatch(RESET())
        await dispatch(logout())
        navigate("/")
    }


    return (
        <header className='header'>
            <nav>
                <div className="logo" onClick={goHome}>
                    <BiLogIn size={35} />
                    <span>AUTH:APP</span>
                </div>

                <ul className='home-links'>
                    <ShowOnLogin>

                        <li className='--flex-center'>
                            <FaUserCircle size={20} />
                            <UserName />
                        </li>
                    </ShowOnLogin>
                    <ShowOnLogout>

                        <li>
                            <button className='--btn --btn-primary'>
                                <Link to="/login">Login </Link>
                            </button>
                        </li>
                    </ShowOnLogout>
                    <ShowOnLogin>

                        <li>

                            <NavLink to="/profile" className={activeLink}>Profile </NavLink>

                        </li>

                        <li>
                            <button onClick={logoutUser} className='--btn --btn-secondary' >
                                Logout
                            </button>
                        </li>
                    </ShowOnLogin>
                </ul>
            </nav>
        </header>
    )
}

export default Header