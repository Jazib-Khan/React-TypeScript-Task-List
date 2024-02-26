import { toastErr, toastInfo } from "./toast";

const CatchErr = (err: { code?: string }) => {
    const { code } = err;
    if(code === "auth/invalid-email")
        toastErr("invalid email");
    else if(code === "auth/weak-password")
        toastErr("password should be atleast 6 characters");
    else if(code === "auth/user-not-found")
        toastErr("user not found");
    else if(code === "auth/email-already-in-use")
        toastErr("email already exists");
    else if(code === "auth/wrong-password")
        toastErr("wrong password");
    else if(code === "auth/requires-recent-login")
        toastInfo("please login again");
    else if(code === "unavailable")
        toastErr("firebase client is offline");
    else if(code === "auth/invalid-credential") 
        toastErr("invalid credentials");
    else 
        toastErr("something went wrong");
    console.log(err, err.code);
};

export default CatchErr