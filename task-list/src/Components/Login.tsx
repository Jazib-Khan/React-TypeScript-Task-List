import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';


const Login = () => {
    const [login, setLogin] = useState(true);

    return (
        <div className="w-full md:w-[450px]">
            <h1 className="text-white text-center font-bold text-4xl md:text-6xl mb-10">
                {login ? "Login" : "Register"}
            </h1>
            <div className="flex flex-col gap-3 bg-white w-full p-6 min-h-[150px] rounded-xl drop-shadow-xl">
                <Input name="email" type="email" />
                <Input name="password" type="password" />
                {!login && <Input name="confirm-password" type="password" />}

                {login ? (
                    <>
                        <Button text="Login" />
                        <Button onClick={() => setLogin(false)} text="Register" secondary />
                    </>
                ) : (
                    <> 
                        <Button text="Register" />
                        <Button onClick={() => setLogin(true)} text="Login" secondary />
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;