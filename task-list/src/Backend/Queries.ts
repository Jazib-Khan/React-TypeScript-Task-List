import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType, userType } from "../Types";
import { NavigateFunction } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { defaultUser, setUser, userStorageName } from "../Redux/userSlice";
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

// sign in a user
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

        await updateUserInfo({ id:user.uid, isOnline: true });

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

// signout
export const BE_signOut = (
    dispatch:AppDispatch, 
    goTo: NavigateFunction, 
    setLoading:setLoadingType
) => {

    setLoading(true)

    // logout in firebase
    signOut(auth)
    .then(async () => {

        // route to auth page
        goTo("/auth");

        // set user offline
        await updateUserInfo({ isOffline: true });

        // set currentSelect user to empty user
        dispatch(setUser(defaultUser));

        // remove from local storage
        localStorage.removeItem(userStorageName);

        setLoading(false);
    })
    .catch((err) => CatchErr(err)); 
};

// add user to collection
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

// get user info
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

// update user info
const updateUserInfo = async ({
    id,
    username, 
    img,
    isOnline,
    isOffline,
}: {
    id?: string;
    username?: string;
    img?: string;
    isOnline?: boolean;
    isOffline?: boolean;
}) => {
    if(!id){
        id = getStorageUser().id
    }

    if(id){
        await updateDoc(doc(db, usersColl, id), {
            ...( username && { username }),
            ...( isOnline && { isOnline }),
            ...( isOffline && { isOnline: false }),
            ...( img && { img }),
            lastSeen: serverTimestamp(),
        });
    }
};

// get user from local storage
const getStorageUser = () => {
    const usr = localStorage.getItem(userStorageName)
    if(usr) return JSON.parse(usr)
    else return null
}