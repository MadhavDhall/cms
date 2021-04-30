import React, { useState } from 'react'
import Check from './functions/check'
import Form from './Form.jsx';
import Image from "../photos/form.png"

import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

const AddAdmin = () => {
    const history= useHistory()
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    })
    const form = [
        {
            type: "text",
            name: "name",
            placeholder: "Name",
            icon: "fa fa-user"
        },
        {
            type: "email",
            name: "email",
            placeholder: "E-mail",
            icon: "fas fa-envelope"
        },
        {
            type: "password",
            name: "password",
            placeholder: "Password",
            icon: "fas fa-lock"
        },
        {
            type: "password",
            name: "cpassword",
            placeholder: "Confirm Password",
            icon: "fas fa-lock"
        }
    ]
    const formSubmit = async (e) => {
        e.preventDefault()

        const { name, email, password, cpassword } = data
        if (cpassword === password) {
            setData({
                name: "",
                email: "",
                password: "",
                cpassword: ""
            })

            try {
                const req = await fetch("/cms-admin/add-admin", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name, email, password
                    })
                })
                const res = await req.json()

                if (res.status !== 201) {
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
                    const c = window.confirm(res.message)
                    c ? history.push("/admin/login") : history.push("/admin/login")
                }
            } catch (e) {
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
            toast.warn("Passwords must match.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setData({
                ...data,
                cpassword: ""
            })
        }
    }

    return (
        <>
            <Check url="add-admin" />
            <div className="center-box container">
                <div className="row box gy-3 p-2 p-md-3 p-lg-5">
                    <h2 className="text-center mb-4 m-0">Add Admin</h2>

                    <Form submit={formSubmit} submitValue="Add Admin" inputs={form} data={data} setData={setData} />

                    <figure className="col-12 m-auto col-md-5 col-lg-5 col-xl-5">
                        <img src={Image} className="img-fluid" alt="Add admin" />
                    </figure>
                </div>
            </div>
        </>
    )
}

export default AddAdmin
