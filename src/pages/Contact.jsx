import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"

function Contact (){

    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading , setLoading] = useState(false)

    const params = useParams()

    useEffect(()=>{
        const getLandlord = async () =>{
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                setLandlord(docSnap.data())
                setLoading(true)
            } else {
                toast.error('Could not get landlord data')
            }
        }
        getLandlord()

    },[params.landlordId])

    const onChange = (e)=>{
        setMessage(e.target.value)
    }

    return(
        <div className="pageContainer">
            <header>
                <p className="pageHeader"> Contact Landlord</p>
            </header>
            {!loading ? (
                <Spinner />
            )
            :
            (<>
            {landlord !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">Contact {landlord?.name}</p>
                    </div>
                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">
                                Message
                            </label>
                            <textarea name="message" id="message" className="textarea h-[300px] rounded-lg border p-3" value={message} onChange={onChange}></textarea>
                        </div>
                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button className="flex justify-center mx-auto text-white font-medium text-[20px] bg-primary rounded-lg px-6 py-2 w-[60%] cursor-pointer hover:bg-dark" type="button">Send Message</button>
                        </a>
                    </form>
                </main>
            )}
            </>)}

        </div>
    )
}
export default Contact