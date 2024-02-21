import React from 'react'
import { Outlet } from 'react-router'

type Props = {}

function Layout({}: Props) {
    return (
        <div>
            <h1>HEADER</h1>
            <Outlet />

        </div>
    )
}

export default Layout