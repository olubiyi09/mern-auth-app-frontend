import React, { useState } from 'react'
import Card from '../../components/card/Card'
import "./ChangePassword.scss"
import PageMenu from '../../components/pageMenu/PageMenu'
import PasswordInput from '../../components/passwordInput/PasswordInput'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RESET, changePassword, logout } from '../../redux/features/auth/authSlice'
import { SpinnerImg } from '../../components/loader/Loader'
import { sendAutomatedEmail } from '../../redux/features/email/emailSlice'

const initialState = {
    oldPassword: "",
    password: "",
    password2: "",
}

const ChangePassword = () => {
    useRedirectLoggedOutUser("/login")
    const [formData, setFormData] = useState(initialState)
    const { oldPassword, password, password2 } = formData

    const { isLoading, user } = useSelector((state) => state.auth)


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const updatePassword = async (e) => {
        e.preventDefault()
        if (!oldPassword || !password || !password2) {
            return toast.error("All fields are required")
        }

        if (password !== password2) {
            return toast.error("Passwords do not match")
        }

        const userData = {
            oldPassword,
            password
        }

        const emailData = {
            subject: "Password Changed - AUTH:APP",
            send_to: user.email,
            reply_to: "noreply@example.com",
            template: "changePassword",
            url: "/forgot",
        }

        await dispatch(changePassword(userData))
        await dispatch(sendAutomatedEmail(emailData))
        await dispatch(logout())
        await dispatch(RESET())
        navigate("/login")
    }


    return (
        <section>
            <div className="container">
                <PageMenu />
                <h2>Change Password</h2>
                <div className="--flex-start change-password">
                    <Card cardClass={"card"}>
                        <>
                            <div>
                                <form onSubmit={updatePassword}>

                                    <p>
                                        <label>Old Password:</label>
                                        <PasswordInput
                                            placeholder="Current Password"
                                            name="oldPassword"
                                            value={oldPassword}
                                            onChange={handleInputChange}
                                        />

                                    </p>

                                    <p>
                                        <label>New Password:</label>
                                        <PasswordInput
                                            placeholder="Password"
                                            name="password"
                                            value={password}
                                            onChange={handleInputChange}
                                        />
                                    </p>

                                    <p>
                                        <label>Confirm New Password:</label>
                                        <PasswordInput
                                            placeholder="Confirm Password"
                                            name="password2"
                                            value={password2}
                                            onChange={handleInputChange}
                                        />
                                    </p>

                                    {isLoading ? <SpinnerImg /> : (
                                        <button type="submit" className="--btn --btn-danger --btn-block">
                                            Change Password
                                        </button>)}

                                </form>
                            </div>
                        </>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default ChangePassword