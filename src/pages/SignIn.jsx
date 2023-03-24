import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function SignIn(){

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email:'',
        password:''
    })

    const{email, password} = formData

    const navigate = useNavigate()

    const onChange = (e) =>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) =>{
        e.preventDefault()
        
        try {

            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            
            if(userCredential.user)
            {
                navigate('/profile')
            }

        } catch (error) {
            toast.error('Bad User Credentials')
        }
        
    }

    return(
        <div className="mx-4 tablet:mx-0 flex justify-center items-center pt-12 pb-20">
            <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-50 text-gray-800">
                <h1 className="text-2xl font-bold text-center">Welcome Back!</h1>
                <form onSubmit={onSubmit} className="space-y-6 ng-untouched ng-pristine ng-valid">
                    <div className="space-y-1 text-sm">
                        <label for="username" className="block text-gray-600">Email</label>
                        <input type="email" 
                            placeholder="Email" 
                            id="email" 
                            value={email} 
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:border-sky-600"
                            />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label for="password" className="block text-gray-600">Password</label>
                        <input type={showPassword ? 'text' : 'password'} 
                        className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:border-sky-600" 
                        placeholder="Password" 
                        id="password" value={password} 
                        onChange={onChange} />
                        <div className="flex justify-end text-xs text-gray-600">
                            <Link to="/forgot-password" className="font-normal">Forgot Password?</Link>
                        </div>
                    </div>
                    <button className="block w-full p-3 text-center rounded-md text-gray-50 bg-primary">Sign in</button>
                </form>
                <div className="flex items-center pt-4 space-x-1">
                    <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
                    <p className="px-3 text-sm text-gray-600">Login with social accounts</p>
                    <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
                </div>
                <div className="flex justify-center space-x-4">
                    <OAuth/>
                </div>
                <p className="text-xs text-center sm:px-6 text-gray-600">Don't have an account?
                    <Link to='/sign-up' className="underline text-gray-800">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );

}
export default SignIn