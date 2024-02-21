import React from 'react'
import { Outlet } from 'react-router'
import Header from '../Components/Header'

type Props = {}

function Layout({}: Props) {
    return (
        <div>
            <Header />
            <Outlet />

        </div>
    )
}

export default Layout