import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType } from "../Type";

// register or signup a user
export const BE_signUp = (
    data: authDataType,
    setLoading: setLoadingType,
    reset: () => void
) => {
    const {email, password, confirmPassword} = data;

    // loading true
    setLoading(true)

    if (email && password) {
        if (password === confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
                console.log(user);
                setLoading(false);
                reset();
                // go to dashboard
            })
            .catch((err) => {
                CatchErr(err);
                setLoading(false);
            });
        } else toastErr("Passwords don't match!")
    } else toastErr("Please fill in all fields");
};

export const BE_signIn = (
    data: authDataType,
    setLoading: setLoadingType,
    reset: () => void
) => {
    const {email, password} = data

    // loading true
    setLoading(true)

    signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
        console.log(user);
        setLoading(false);
        reset();
        // go to dashboard
    })
    .catch((err) => {
        CatchErr(err);
        setLoading(false);
    });
};