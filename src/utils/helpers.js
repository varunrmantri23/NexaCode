import {
    signInWithRedirect,
    GoogleAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
    await signInWithRedirect(auth, googleProvider).then((userCred) => {
        window.location.reload();
    });
};

export const signInWithGithub = async () => {
    await signInWithRedirect(auth, githubProvider).then((userCred) => {
        window.location.reload();
    });
};
