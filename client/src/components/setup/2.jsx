import React, { useState } from 'react'
import Image from "../../photos/form.png"
import { useHistory } from 'react-router';
import Check from '../functions/check';
import { toast } from 'react-toastify';
import Form from '../Form';

const Setup2 = () => {
    const form = [
        {
            type: "text",
            name: "wname",
            placeholder: "Website Name",
            icon: "fas fa-window-maximize"
        },
        {
            type: "text",
            name: "name",
            placeholder: "Owner Name",
            icon: "fa fa-user"
        },
        {
            type: "email",
            name: "email",
            placeholder: "Owner E-mail",
            icon: "fas fa-envelope"
        },
        {
            type: "password",
            name: "password",
            placeholder: "Owner Password",
            icon: "fas fa-lock"
        },
        {
            type: "password",
            name: "cpassword",
            placeholder: "Confirm Owner Password",
            icon: "fas fa-lock"
        }
    ]

    const history = useHistory()

    const [data, setData] = useState({
        wname: "",
        name: "",
        email: "",
        password: "",
        cpassword: ""
    })

    const formSubmit = async (e) => {
        e.preventDefault()
        const { wname, email, name, password, cpassword } = data
        
        if(password === cpassword){
        setData({
            wname: "",
            name: "",
            email: "",
            password: "",
            cpassword: ""
        })
        try {
            const sendReq = await fetch("/cms-admin/setup/2", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wname, email, name, password
                })
            })
            const res = await sendReq.json()

            if (sendReq.status !== 201) {
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
                toast.success("Click on the link sent on E-mail given to verify.", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    history.push("/admin/setup/2")
                }, 5000)
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
    }else{
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
        <Check url="setup/2"/>
        <div className="center-box container">
            <div className="row box gy-3 p-2 p-md-3 p-lg-5">
                <h2 className="text-center mb-4 m-0">Madhav Dhall CMS Setup(2/2)</h2>

                <Form submit={formSubmit} submitValue="Set CMS" inputs={form} data={data} setData={setData} />

                <figure className="col-12 m-auto col-md-5 col-lg-5 col-xl-5">
                    <img src={Image} className="img-fluid" alt="Register" />
                </figure>
            </div>
        </div>
        </>
    )
}

export default Setup2