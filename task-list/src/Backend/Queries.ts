import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType, userType } from "../Types";
import { NavigateFunction } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { defaultUser } from "../Redux/userSlice";

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
                    "imgLink"
                );
                
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

        

        // get user info
        const userInfo = getUserInfo(user.uid)


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

    return getUserInfo(id);
};

const getUserInfo = async (id:string): Promise<userType> => {

    const userRef = doc(db, usersColl, id);
    const user = await getDoc(userRef);

    if(user.exists()) {
        const { img, isOnline, username, email, bio, creationTime, lastSeen } = 
            user.data();

        return {
            id: user.id,
            img,
            isOnline, 
            username, 
            email, 
            bio,
            creationTime,
            lastSeen,
        };

    } else {
        toastErr("getUserInfo: user not found");
        return defaultUser;
    }
};