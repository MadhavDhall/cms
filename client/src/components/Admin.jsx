import React, { useContext, useState, useEffect } from 'react'
import Header, { SideNav } from './Header.jsx';
import { AdminContext } from './../App';
import Check from './functions/check.js';

const Admin2 = () => {
    const [state, dispatch, data] = useContext(AdminContext)
    console.log(data);
    // const [data, setData] = useState({})
    // const history = useHistory()

    // useEffect(() => {
    //     const check = async () => {
    //         try {
    //             const req = await fetch("/cms-admin")
    //             const res = await req.json()

    //             return res.success ? setData(res.data) : history.push(res.redirect)
    //         } catch (error) {
    //             toast.warn('Server is restarting. Refresh the page and try again.', {
    //                 position: "top-center",
    //                 autoClose: false,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //             });
    //         }
    //     }
    //     check()
    // }, [])

    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <div className="main col">
                        <h1>Admin </h1>
                    </div>
                </div>
            </div>
        </>
    )
}
const Admin = () => {
    const { data } = useContext(AdminContext)
    const [adminData, setAdmindata] = useState({
        name: "",
        email: ""
    })
    useEffect(() => {
        setAdmindata({ name: data.name, email: data.email })
    }, [data])
    return (
        <>
            <Check url="" />
            <Header />

            <section className="admin">
                <SideNav />
                <div>Madhav</div>
            </section>
        </>
    )
}

export default Admin