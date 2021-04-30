import React, { createContext, useState, useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import Setup1 from './components/setup/1.jsx';
import Setup2 from './components/setup/2.jsx';
import Admin from './components/Admin.jsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddAdmin from './components/AddAdmin.jsx';
import ForgotPass from './components/ForgotPass';
import ChangePass from './components/ChangePass';
import Profile from './components/Profile';
import Check from './components/functions/check';
import Admins from './components/Admins.jsx';

export const AdminContext = createContext()
const pages = [
  {
    path: "",
    component: <Admin />
  },
  {
    path: "setup",
    component: <Check url="setup" />
  },
  {
    path: "setup/1",
    component: <Setup1 />
  },
  {
    path: "setup/2",
    component: <Setup2 />
  },
  {
    path: "login",
    component: <Login />
  },
  {
    path: "logout",
    component: <Check url="/logout" />
  },
  {
    path: "logoutall",
    component: <Check url="/logoutall" />
  },
  {
    path: "add-admin",
    component: <AddAdmin />
  },
  {
    path: "forgot-password",
    component: <ForgotPass />
  },
  {
    path: "change-password",
    component: <ChangePass />
  },
  {
    path: "profile",
    component: <Profile />
  },
  {
    path: "admins",
    component: <Admins />
  }
]

const reducer = (state, action) => {
  if (action.type === "changeAdmin") {
    return action.payload
  }
  return state
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, 0)
  const [data, setData] = useState({ name: "", email: "" })
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    const check = async () => {
      try {
        const req = await fetch("/cms-admin")
        const res = await req.json()

        if (res.success) {
          setData({ name: res.data.name, email: res.data.email })
          setAdmins(res.admins)
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
    return check()
  }, [state])
  return (
    <>
      <ToastContainer />

      <AdminContext.Provider value={{ state, dispatch, data, admins }}>
        <Router>
          <Switch>
            {
              pages.map((page, key) => {
                return (
                  <Route path={`/admin/${page.path}`} key={key} exact>
                    {page.component}
                  </Route>
                )
              })
            }

            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </AdminContext.Provider>

      <Footer />
    </>
  )
}

export default App
