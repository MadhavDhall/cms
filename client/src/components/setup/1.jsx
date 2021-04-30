import React, { useState } from 'react'
import Image from "../../photos/form.png"
import { useHistory } from 'react-router';
import Check from './../functions/check';

import { toast } from 'react-toastify';
import Form from '../Form';

const Setup1 = () => {
    const history = useHistory()

    const form = [
        {
            type: "text",
            name: "username",
            placeholder: "User Name",
            icon: "fa fa-user"
        },
        {
            type: "password",
            name: "password",
            placeholder: "Password",
            icon: "fas fa-lock"
        },
        {
            type: "text",
            name: "clusterurl",
            placeholder: "Cluster URL",
            icon: "fas fa-server"
        }
    ]

    const [data, setData] = useState({
        username: "",
        password: "",
        clusterurl: ""
    })

    const formSubmit = async (e) => {
        e.preventDefault()
        const { username, password, clusterurl } = data

        setData({
            username: "",
            password: "",
            clusterurl: ""
        })
        try {
            const sendReq = await fetch("/cms-admin/setup/1", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, password, clusterurl
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
                toast.success('Connection successful. Wait till you are redirected to next setup page.', {
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
    }

    return (
        <>
            <Check url="setup/1" />
            <div className="center-box container">
                <div className="row box gy-3 p-2 p-md-3 p-lg-5">
                    <h2 className="text-center mb-4 m-0">Madhav Dhall CMS Setup (Step 1/2)</h2>
                    <h3 className="m-0">Database Details</h3>
                    <h6>**MongoDB Database Required</h6>

                    <Form submit={formSubmit} submitValue="Next" inputs={form} data={data} setData={setData} />

                    <figure className="col-12 m-auto col-md-5 col-lg-5 col-xl-5">
                        <img src={Image} className="img-fluid" alt="Setup" />
                    </figure>
                </div>

                <h5>Note- If you experience continuous redirect after submitting form or in any process during setup, its not due an error or problem and no need to panic and just wait till it redirects to next form. It happens due to slow server restarting process.</h5><br />
            </div>
        </>
    )
}

export default Setup1
