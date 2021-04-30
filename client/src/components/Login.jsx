import React, { useState, useContext } from 'react'
import Image from "../photos/form.png"
import Check from './functions/check'
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import Form from './Form';
import { AdminContext } from '../App';
import { Link } from 'react-router-dom';

const Login = () => {
    const { state, dispatch } = useContext(AdminContext)
    const history = useHistory()
    const [data, setData] = useState({
        email: "",
        pass: ""
    })

    const form = [
        {
            type: "email",
            name: "email",
            placeholder: "E-mail",
            icon: "fas fa-envelope"
        },
        {
            type: "password",
            name: "pass",
            placeholder: "Password",
            icon: "fas fa-lock"
        }
    ]

    const formSubmit = async (e) => {
        e.preventDefault()

        const { email, pass } = data

        setData({
            email: "",
            pass: ""
        })

        try {
            const sendReq = await fetch("/cms-admin/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, pass
                })
            })

            const res = await sendReq.json()
            console.log(res);

            if (sendReq.status !== 200) {
                toast.warn(res.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                dispatch({ type: "changeAdmin", payload: state + 1 })
                history.push("/admin")
            }
        } catch (error) {
            console.log(error);
            toast.warn("Server is restarting. Refresh the page and try again.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    return (
        <>
            <Check url="login" />
            <div className="center-box container">
                <div className="row box gy-3 p-3 p-md-3 p-lg-5">
                    <h2 className="text-center mb-4 m-0">Madhav Dhall CMS Login</h2>

                    <Form submit={formSubmit} submitValue="Login" inputs={form} data={data} setData={setData} />

                    <figure className="col-12 m-auto col-md-5 col-lg-5 col-xl-5">
                        <img src={Image} className="img-fluid" alt="Login" />
                    </figure>
                    <Link to="/admin/forgot-password" className="my-0">Forgot Password</Link>
                </div>
            </div>
        </>
    )
}

export default Login
