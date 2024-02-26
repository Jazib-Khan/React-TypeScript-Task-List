import React from 'react'
import { userType } from '../Types'

type Props = {
    user?: userType,
    handleClick?:() => void;
}

function UserHeaderProfile({user, handleClick }: Props) {
    return (
        <div 
            onClick={handleClick} 
            className='flex items-center space-x-4 cursor-pointer'
        >
            <div className="relative">
                <img 
                    src={"https://api.multiavatar.com/Jazib.png"} 
                    alt="user profile" 
                    className="w-11 h-11 rounded-full ring-2 ring-white p-[2px]"
                />
                <span className="-top-1 left-7 absolute w-4 h-4 border-2 border-gray-800 rounded-full bg-green-400"></span>
            </div>
            <div className="hidden md:block">
                <div className="-mb-1">Jazib Khan</div>
                <div className="text-sm text-gray-300">
                    Joined in Mon 26th, Feb, 2024
                </div>
            </div>
        </div>
    )
}

export default UserHeaderProfile