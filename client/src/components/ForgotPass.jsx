import React, { useState } from 'react'
import Form from './Form';
import { toast } from 'react-toastify';
import Check from './functions/check';
import Image from '../photos/form.png';

const ForgotPass = () => {
    const form = [
        {
            type: "email",
            placeholder: "Your E-mail",
            name: "email",
            icon: "fas fa-envelope"
        }
    ]
    const [data, setData] = useState({
        email: ""
    })

    const formSubmit = async (e) => {
        e.preventDefault()
        const { email } = data
        setData({
            email: ""
        })
        try {
            const req = await fetch("/cms-admin/forgot-password", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            })
            const res = await req.json()

            if (res.status !== 200) {
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
                toast.success(res.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
            <Check url="forgot-password" />
            <div className="center-box container">
                <div className="row box gy-3 p-2 p-md-3 p-lg-5">
                    <h2 className="text-center mb-4 m-0">Forgot Password</h2>

                    <Form submit={formSubmit} submitValue="Reset Password" inputs={form} data={data} setData={setData} />

                    <figure className="col-12 m-auto col-md-5 col-lg-5 col-xl-5">
                        <img src={Image} className="img-fluid" alt="Forgot Password" />
                    </figure>
                </div>
            </div>
        </>
    )
}

export default ForgotPass
