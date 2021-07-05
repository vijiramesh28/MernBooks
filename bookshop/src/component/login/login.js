import React, {useState} from 'react';
import './login.css';
import { auth ,googleProvider } from '../../firebase';
const Login = () => {
    const [user, setUser] = useState(null);
    const GAuthLogin=async()=>{
        try {
            await auth.signInWithPopup(googleProvider);
            setUser(await auth.currentUser);

        } catch (error) {
            console.log(error);
        }
        console.log(user);
    }

    return (
        <>
            <div className="back_login">
                <div className="login_box">
                    <img src="https://image.flaticon.com/icons/png/512/281/281764.png" alt="google logo" className="g_img"></img>
                    <button className="g_btn" onClick={GAuthLogin}>Login with Google</button>
                </div>
                <div className="dis_name">
                    <h1>{user?.displayName}</h1>
                </div>
            </div>

        </>
    )
}

export default Login;
