import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {doc, setDoc, serverTimestamp} from "firebase/firestore"; 
import {db} from "../firebase.config"
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";


function SignUp(){

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:''
    })

    const{name, email, password} = formData

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
            const userCredential = await createUserWithEmailAndPassword(auth, email,password)
            const user = userCredential.user

            updateProfile(auth.currentUser,{
                displayName: name
            })

            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')

        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return(
        <>

        <div className="mx-4 tablet:mx-0 flex justify-center items-center pt-12 pb-20">
            <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-50 text-gray-800">
                <h1 className="text-2xl font-bold text-center">Sign up</h1>
                <form onSubmit={onSubmit} className="space-y-6 ng-untouched ng-pristine ng-valid">
                    <div className="space-y-1 text-sm">
                        <label for="username" className="block text-gray-600">Name</label>
                        <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:border-sky-600" 
                        placeholder="name" 
                        id="name" 
                        value={name} 
                        onChange={onChange} 
                        />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label for="username" className="block text-gray-600">Email</label>
                        <input type="email" 
                        className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:border-sky-600" 
                        placeholder="Email" 
                        id="email" 
                        value={email} 
                        onChange={onChange} 
                        />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label for="password" className="block text-gray-600">Password</label>
                        <input type='password'
                        className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:border-sky-600" 
                        placeholder="Password" 
                        id="password" value={password} 
                        onChange={onChange} 
                        />
                    </div>
                    <button className="block w-full p-3 text-center rounded-sm text-gray-50 bg-primary hover:bg-dark">Sign up</button>
                </form>
                <div className="flex items-center pt-4 space-x-1">
                    <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
                    <p className="px-3 text-sm text-gray-600">Sign up with social accounts</p>
                    <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
                </div>
                <div className="flex justify-center space-x-4">
                    <OAuth/>
                </div>
                <p className="text-xs text-center sm:px-6 text-gray-600">You have an account?
                    <Link to='/sign-in' className="underline text-gray-800">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
            {/* <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome!
                    </p>                   
                </header>
                <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    className="nameInput" 
                    placeholder="name" 
                    id="name" 
                    value={name} 
                    onChange={onChange} />


                    <input type="email" 
                    className="emailInput" 
                    placeholder="Email" 
                    id="email" 
                    value={email} 
                    onChange={onChange} />

                    <div className="passwordInputDiv">
                        <input type={showPassword ? 'text' : 'password'} 
                        className="passwordInput" 
                        placeholder="Password" 
                        id="password" value={password} 
                        onChange={onChange} />

                        <img src={visibilityIcon} 
                        alt="show password" 
                        className="showPassword" 
                        onClick={()=>setShowPassword((prevState =>!prevState))}/>
                        
                        <div className="signUpBar">
                            <p className="signUpText">
                                Sign Up
                            </p>
                            <button className="signUpButton">
                                <ArrowRightIcon fill="#ffffff" width='34px' height='34px' />
                            </button>
                        </div>
                    </div>
                </form>
                <OAuth/>
                 <Link to='/sign-in' className="registerLink">
                    Sign In Instead
                 </Link>
            </div> */}
        </>
    );

}
export default SignUp