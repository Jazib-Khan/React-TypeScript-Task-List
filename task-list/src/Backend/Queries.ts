import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType, userType } from "../Types";
import { NavigateFunction } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { defaultUser, setUser } from "../Redux/userSlice";
import { AppDispatch } from "../Redux/store";
import ConvertTime from "../utils/ConvertTime";
import AvatarGenerator from "../utils/avatarGenerator";

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
    goTo: NavigateFunction,
    dispatch: AppDispatch
) => {
    const {email, password, confirmPassword} = data;

    // loading true
    setLoading(true)

    if (email && password) {
        if (password === confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
            .then(async ({ user }) => {
    
                const imgLink = AvatarGenerator(user.email?.split("@")[0]);

                const userInfo = await addUserToCollection(
                    user.uid, 
                    user.email || "", 
                    user.email?.split("@")[0] || "",
                    imgLink
                );

                // set user in store
                dispatch(setUser(userInfo));

                setLoading(false);
                reset();
                goTo("/dashboard");
            })
            .catch((err) => {
                CatchErr(err);
                setLoading(false);
            });
        } else toastErr("Passwords don't match!", setLoading);
    } else toastErr("Please fill in all fields", setLoading);
};

export const BE_signIn = (
    data: authDataType,
    setLoading: setLoadingType,
    reset: () => void,
    goTo: NavigateFunction,
    dispatch: AppDispatch
) => {
    const {email, password} = data

    // loading true
    setLoading(true)

    signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {

        // get user info
        const userInfo = await getUserInfo(user.uid);

        // set user in store
        dispatch(setUser(userInfo));

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
            creationTime: creationTime 
                ? ConvertTime(creationTime.toDate()) 
                : "no date yet: userinfo",
            lastSeen: lastSeen 
                ? ConvertTime(lastSeen.toDate())
                : "no date yet: userinfo",
        };
    } else {
        toastErr("getUserInfo: user not found");
        return defaultUser;
    }
};