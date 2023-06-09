import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {toast} from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

function ForgotPassword(){

    const[email, setEmail] = useState('')

    const onChange = (e) =>{
        setEmail(e.target.value)
    }

    const onSubmit = async (e) =>{
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success('Email was sent')
        } catch (error) {
            toast.error('Could not send reset email')
        }
    }

    return(
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Reset Password</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <input type="email" 
                    className="emailInput" 
                    placeholder="Email" 
                    id="email" 
                    value={email} 
                    onChange={onChange} />
                    <div className="signInBar">
                        <div className="signInText">Sent Reset Link</div>
                        <button className="signInButton">
                            <ArrowRightIcon fill="#fff" width='34px' height='34px'/>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );

}
export default ForgotPassword