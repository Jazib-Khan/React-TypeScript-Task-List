import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";

export const BE_signUp = (data: {
    email: string; 
    password: string; 
    confirmPassword: string;
}) => {
    const {email, password, confirmPassword} = data;

    if (email && password) {
        if (password === confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                console.log(user);
            })
            .catch((err) => CatchErr(err));
        } else toastErr("Passwords don't match!")
    } else toastErr("Please fill in all fields");
};