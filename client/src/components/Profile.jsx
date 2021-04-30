import React, { useContext, useState, useEffect } from 'react'
import { AdminContext } from '../App'
import Check from './functions/check'
import Header, { SideNav } from './Header'
import Form from './Form';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { data } = useContext(AdminContext)
    const [adminData, setAdminData] = useState(data)

    const inputs = [
        {
            type: "text",
            placeholder: "Your Name",
            name: "name",
            icon: "fa fa-user"
        }
    ]

    const [name, setName] = useState({ name: adminData.name })

    const changeName = async (e) => {
        e.preventDefault()

        try {
            const req = await fetch("/cms-admin/change-name", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: name.name })
            })
            const res = await req.json()
            if (req.status !== 201) {
                toast.warn(res.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.success("Name changed successfully.", {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }
        } catch (error) {

        }
    }

    const [MainForm, setForm] = useState(<Form inputs={inputs} data={name} setData={setName} submit={changeName} submitValue="Change Nam" />)

    useEffect(() => {
        setAdminData(data)
        setName({ name: data.name })
    }, [data])

    useEffect(() => {
        setForm(<Form inputs={inputs} data={name} setData={setName} submit={changeName} submitValue="Change Name" />)
    }, [name])

    const changePassword = async () => {
        try {
            const req = await fetch("/cms-admin/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: adminData.email })
                })

            const res = await req.json()
            if (req.status !== 201) {
                toast.warn(res.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.success(res.message, {
                    position: "top-center",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            toast.warn('Server is restarting. Refresh the page and try again.', {
                position: "top-center",
                autoClose: false,
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
            <Check url="" />
            <Header />
            <div className="admin">
                <SideNav />
                <div className="col container my-3">
                    <h1>Your Profile</h1><br />
                    <h5>Email: {adminData.email}</h5>
                    <h5>Name: {adminData.name}</h5><br />

                    {MainForm}<br />

                    <button onClick={changePassword} className="btn btn-outline-secondary">Change Password</button>

                    <br /><br /><br/>
                    <Link to="/admin/logoutall" className="btn btn-danger mt-auto">Logout from all devices</Link>
                </div>
            </div>
        </>
    )
}

export default Profile