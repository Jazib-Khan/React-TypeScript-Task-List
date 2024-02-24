import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType } from "../Type";
import { NavigateFunction } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

// collection names
const usersColl = "users";
const tasksColl = "tasks";
const taskListColl = "taskList";
const chatsColl = "chats";
const messagesColl = "messages";

// register or signup a user
export const BE_signUp = (
    data: authDataType,
    setLoading: setLoadingType,
    reset: () => void,
    goTo: NavigateFunction
) => {
    const {email, password, confirmPassword} = data;

    // loading true
    setLoading(true)

    if (email && password) {
        if (password === confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {

                const userInfo = addUserToCollection(
                    user.uid, 
                    user.email || "", 
                    user.email?.split("@")[0] || "",
                    "imgLink");
                
                setLoading(false);
                reset();
                goTo("/dashboard");
            })
            .catch((err) => {
                CatchErr(err);
                setLoading(false);
            });
        } else toastErr("Passwords don't match!");
    } else toastErr("Please fill in all fields");
};

export const BE_signIn = (
    data: authDataType,
    setLoading: setLoadingType,
    reset: () => void,
    goTo: NavigateFunction
) => {
    const {email, password} = data

    // loading true
    setLoading(true)

    signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
        console.log(user);
        setLoading(false);
        reset();
        goTo("/dashboard");
    })
    .catch((err) => {
        CatchErr(err);
        setLoading(false);
    });
};

const addUserToCollection = async (
    id:string, 
    email:string, 
    username:string, 
    img:string
) => {
    await setDoc(doc(db, usersColl, id), {
        isOnline:true,
        img,
        username,
        email,
        creationTime: serverTimestamp(),
        lastSeen:serverTimestamp(),
        bio: `Hi! my name is ${username}`
    });

// return user info
};
