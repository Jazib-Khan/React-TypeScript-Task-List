import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { toast } from "react-toastify";

export const BE_signUp = (data: {
    email: string; 
    password: string; 
    confirmPassword: string;
}) => {
    const {email, password, confirmPassword} = data;

    if (email && password) {
        if (password === confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                console.log(userCred);
            })
            .catch((err) => console.log(err));
        } else console.log("Passwords don't match!")
    } else {
        toast.warn("Fields shouldn't be left empty!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
};