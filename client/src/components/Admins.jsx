import React, { useContext, useEffect, useState } from 'react'
import Check from './functions/check'
import Header, { SideNav } from './Header'
import { AdminContext } from './../App';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import Form from './Form';

const AddAdmin = () => {
    const [addForm, setAddForm] = useState("")

    useEffect(() => {
        const check = async () => {
            try {
                const req = await fetch('/cms-admin/add-admin')
                const res = await req.json()

                if (res.success) {
                    setAddForm(<>
                        <h2>Add Admin</h2><br />
                        <Form submit={formSubmit} submitValue="Add Admin" inputs={form} data={data} setData={setData} />
                    </>)
                }
            } catch (error) {

            }
        }
        check()
    }, [])

    const history = useHistory()
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
    return addForm
}

const Admins = () => {
    const { admins } = useContext(AdminContext)
    const [adminsTable, setAdminsTable] = useState("")

    useEffect(() => {
        const table = admins.map((admins, key) => {
            return (
                <tr key={key}>
                    <td>{++key}</td>
                    <td>{admins.name} <b>{admins.owner ? "(Owner)" : ""}</b></td>
                    <td>{admins.email}</td>
                </tr>
            )
        })

        setAdminsTable(
            <div className="scrollable">
                <table className="table table-striped table-hover table-light">
                    <thead className="table-primary">
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table}
                    </tbody>
                </table>
            </div>)
    }, [admins])
    return (
        <>
            <Check url="" />
            <Header />

            <div className="admin">
                <SideNav />
                <div className="col container my-3">
                    {adminsTable} <br />

                    <AddAdmin />
                </div>
            </div>
        </>
    )
}

export default Admins
