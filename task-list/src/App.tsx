import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";

function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<LoginPage />} />
                <Route path="/product/:id/another" element={<h1>Product</h1>} />
                <Route path="/dashboard" element={<h1>Dashboard</h1>} >
                    <Route path="first" element={<h1>Home</h1>} />
                    <Route path="second" element={<h1>Profile</h1>} />
                    <Route path="third" element={<h1>Settings</h1>} />
                </Route>
                <Route path="*" element={<h1>Not found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
