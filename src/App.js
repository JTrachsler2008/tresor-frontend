import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import './css/mvp.css';
import Home from './pages/Home';
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Users from './pages/user/Users';
import LoginUser from "./pages/user/LoginUser";
import RegisterUser from "./pages/user/RegisterUser";
import EditUser from "./pages/user/EditUser";
import Secrets from "./pages/secret/Secrets";
import NewCredential from "./pages/secret/NewCredential";
import NewCreditCard from "./pages/secret/NewCreditCard";
import NewNote from "./pages/secret/NewNote";
import AllSecrets from "./pages/secret/AllSecrets";

/**
 * App
 * @author Peter Rutschmann
 */
function App() {
    const [loginValues, setLoginValues] = useState({
        email: "",
        password: "",
        userId: null,
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout loginValues={loginValues} setLoginValues={setLoginValues}/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/user/users" element={<Users loginValues={loginValues}/>}/>
                    <Route path="/user/login" element={<LoginUser loginValues={loginValues} setLoginValues={setLoginValues}/>}/>
                    <Route path="/user/register" element={<RegisterUser loginValues={loginValues} setLoginValues={setLoginValues}/>}/>
                    <Route path="/user/edit/:id" element={<EditUser loginValues={loginValues}/>}/>
                    <Route path="/secret/secrets" element={<Secrets loginValues={loginValues}/>}/>
                    <Route path="/secret/newcredential" element={<NewCredential loginValues={loginValues}/>}/>
                    <Route path="/secret/newcreditcard" element={<NewCreditCard loginValues={loginValues}/>}/>
                    <Route path="/secret/newnote" element={<NewNote loginValues={loginValues}/>}/>
                    <Route path="/secret/allsecrets" element={<AllSecrets loginValues={loginValues}/>}/>
                    <Route path="*" element={<NoPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;// navbar 
