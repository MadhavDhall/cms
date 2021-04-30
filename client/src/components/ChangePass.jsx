import React, { useState } from 'react'
import Form from './Form';
import Check from './functions/check';
import Image from "../photos/form.png"
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

const ChangePass = () => {
    const queryString = window.location.search;

    const history = useHistory()
    const form = [
        {
            type: "password",
            placeholder: "New Password",
            name: "password",
            icon: "fas fa-lock"
        },
        {
            type: "password",
            placeholder: "Confirm New Password",
            name: "cpassword",
            icon: "fas fa-lock"
        }
    ]
    const [data, setData] = useState({
        password: "",
        cpassword: ""
    })

    const formSubmit = async (e) => {
        e.preventDefault()
        const { password, cpassword } = data
        if (cpassword === password) {
            try {
                const req = await fetch(`/cms-admin/change-password${queryString}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password })
                })
                const res = await req.json()

                if (req.status !== 201) {
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
                    const c = window.confirm("Password changed successfully.")

                    c ? history.push("/admin/login") : history.push("/admin/login")
                }
            } catch (error) {
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
        } else {
            setData({
                ...data,
                cpassword: ""
            })
            toast.warn("Both passwords must match", {
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
            <Check url={`change-password${queryString}`} />
            <div className="center-box container">
                <div className="row box gy-3 p-2 p-md-3 p-lg-5">
                    <h2 className="text-center mb-4 m-0">Change Password</h2>

                    <Form submit={formSubmit} submitValue="Change Password" inputs={form} data={data} setData={setData} />

                    <figure className="col-12 m-auto col-md-5 col-lg-5 col-xl-5">
                        <img src={Image} className="img-fluid" alt="Forgot Password" />
                    </figure>
                </div>
            </div>
        </>
    )
}

export default ChangePass