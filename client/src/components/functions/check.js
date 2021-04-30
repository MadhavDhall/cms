import React, { useEffect } from 'react'
import { useHistory } from 'react-router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Check = (props) => {
    const history = useHistory()

    useEffect(() => {
        const sendReq = async () => {
            try {
                const req = await fetch(`/cms-admin/${props.url}`)
                const res = await req.json()

                console.log(res);
                return res.success ? "" : history.push(res.redirect)
            } catch (error) {
                // console.log(error);
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
        sendReq()
    }, [history, props.url])
    return (
        <ToastContainer />
    )
}
export default Check