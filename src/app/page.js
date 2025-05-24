"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./home.css";
import { sendResetPasswordEmail, signinWithEmailPassword, signout, signupWithEmailPassword } from "@/utils/actions";
import { Box, CircularProgress } from "@mui/material";
import { TbLockPassword } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";



const PageCo = () => {
    const searchParams = useSearchParams();
    const nav = useRouter();
    const authType = searchParams.get("authtype") || "login";

    useEffect(() => {
        if(!localStorage.getItem("reloaded")){
            window.location.reload();
        }
        localStorage.setItem("reloaded",true);
    },[])
    
    const [formData, setFormData] = useState({
        cms_id: "",
        password: "",
        email: "",
        crewname: "",
        designation: "",
        hq: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [fetching, setFetching] = useState(false);

    const validateForm = () => {
        if (authType === "signup" || authType === "login") {
            if (!/\d{6}/.test(formData.password)) {
                setPasswordError("Password must be 6 digits (only numbers).");
                return false;
            }
        }
        setPasswordError("");
        return true;
    };

    useEffect(() => {
            // Re-apply styles or trigger a reflow after page transition
            document.body.style.display = 'none';
            document.body.offsetHeight;  // Force reflow
            document.body.style.display = '';
          }, [nav.asPath]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        setFetching(true);
        try {
            if (authType === "signup") {
                const response = await fetch('/api/NewEntrySubmit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    await signupWithEmailPassword({ email: formData.email, password: formData.password });
                    alert("Sign-up successful! Please check your provided email for verification.|| साइन-अप सफल हुआ! कृपया सत्यापन के लिए अपने ईमेल की जांच करें। ");
                    nav.push("/?authtype=login");
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Something went wrong'}`);
                }
            } else if (authType === "login") {
                const response = await fetch(`/api/users/${formData.cms_id}`);
                if (response.ok) {
                    const { data } = await response.json();
                    const { success,error } = await signinWithEmailPassword({ email: data.email, password: formData.password });
                    if (success) {
                        alert("Logged in successfully! || सफलतापूर्वक लॉगिन हो गया!");
                        nav.push("/home");
                    } else {
                        if(data.email){
                            alert("Wrong Password!!(U can reset password by clicking forgot password || गलत पासवर्ड!! (आप 'पासवर्ड भूल गए' पर क्लिक करके पासवर्ड रीसेट कर सकते हैं।)")
                            document.getElementById("password").value = "";
                            setFormData((prevdata) => ({
                                ...prevdata,
                                password: ""
                            }));   
                        }else{
                            alert("You are not yet registered/authenticated in our website || आप अभी तक हमारी वेबसाइट पर पंजीकृत/प्रमाणित नहीं हैं।")
                            document.getElementById("password").value = "";
                            setFormData((prevdata) => ({
                                ...prevdata,
                                password: ""
                            }));   
                            nav.push("/?authtype=signin")
                        }
                    }
                } else {
                    alert("CMS ID not found. || CMS ID उपलब्ध नहीं है।");
                    document.getElementById("password").value = "";
                            setFormData((prevdata) => ({
                                ...prevdata,
                                password: ""
                            })); 
                    nav.push("/?authtype=signup")
                }
            } else if (authType === "reset-password") {
                const response = await fetch(`/api/users/${formData.cms_id}`);
                if (response.ok) {
                    const { data } = await response.json();
                    const { success } = await sendResetPasswordEmail({ email: data.email });
                    if (success) {
                        alert("You received a reset-password email link. Please click on the link in the email. || आपको एक पासवर्ड रीसेट ईमेल लिंक प्राप्त हुआ है। कृपया ईमेल में दिए गए लिंक पर क्लिक करें।");
                        nav.push("/?authtype=login");
                    }
                    else{
                        if (data.email) {
                            console.error("Temporary server issue detected.");
                            alert("There was an error. Please wait for 2 minutes and try submitting again. || एक त्रुटि हुई है। कृपया 2 मिनट प्रतीक्षा करें और फिर से सबमिट करने का प्रयास करें।");
                        } else {
                            alert("User is not registered in our app, Redirecting to sign-in page. || उपयोगकर्ता हमारे app में पंजीकृत नहीं है, साइन-इन पृष्ठ पर पुनः निर्देशित किया जा रहा है।");
                            nav.push("/?authtype=signin");
                        }                        
                    }
                } else {
                    alert("CMS ID not found. || CMS ID उपलब्ध नहीं है।");
                    nav.push("/?authtype=signup")
                }
            }else if(authType === "signin"){
                const response = await fetch(`api/users/${formData.cms_id}`,{
                    method : "PUT",
                    headers : { 'Content-Type': 'application/json' },
                    body : JSON.stringify({email : formData.email})
                })
                if(response.ok){
                    const {error,success} = await signupWithEmailPassword({email : formData.email,password:formData.password});
                    if(success){
                        alert("Sign-in successful! Please check your provided email for verification.|| साइन-ईन सफल हुआ! कृपया सत्यापन के लिए अपने ईमेल की जांच करें।")
                        nav.push("/?authtype=login");
                    }else{
                        alert("An error occurred")
                    }
                }else{
                    alert("CMS ID is not found || || CMS ID उपलब्ध नहीं है।")
                    nav.push("/?authtype=signup")
                }
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("Something went wrong. Please try again later. || कुछ गलत हो गया है। कृपया बाद में फिर से प्रयास करें।");
        }finally{
            setFetching(false)
        }

    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "cms_id") {
            setFormData({ ...formData, [id]: value.toUpperCase() }); // Convert CMS ID to uppercase
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };
    

    return (
        <div className="mini-container">
            <div className="container">
            {/* <div>
                <form action={signout}>
                    <button type="submit">Sign Out</button>
                </form>
            </div> */}
            <div className="left-section">
                <div className="image-logo">
                    <img src="/home-1.png" alt="logo" />
                </div>
                <div className="heading">
                    <h1>AR Royal Fort</h1>
                </div>
                <div className="sub-heading">
                    <h2>Running Room Governance</h2>
                </div>
                {/* <div className="sub-heading">
                    <h2></h2>
                </div> */}
                <div className="sub-heading">
                    <h2>Vizianagaram.</h2>
                </div>
            </div>

            <form className="right-section" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cms_id"><FiUser/>CMS ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cms_id"
                        placeholder="Enter your CMS ID"
                        onChange={handleChange}
                        required
                    />
                </div>

                {authType !== "reset-password" && (
                    <div className="form-group">
                    <label htmlFor="password"> <TbLockPassword></TbLockPassword> Password: </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your 6-digit (number)"
                        onChange={handleChange}
                        required
                    />
                    {passwordError && <span className="error-message">{passwordError}</span>}
                </div>                
                )}

                {authType === "signin" && (
                    <>
                        <div className="form-group">
                            <label htmlFor="email"><MdOutlineAlternateEmail/>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your Email"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )
                }

                {authType === "signup" && (
                    <>
                        <div className="form-group">
                            <label htmlFor="email"><MdOutlineAlternateEmail/>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your Email"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="crewname"><MdOutlineDriveFileRenameOutline/>Crew Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="crewname"
                                placeholder="Enter your Name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="designation"><LuUsers/>Designation:</label>
                            <select className="form-control" id="designation" onChange={handleChange} required>
                                <option value="">Select your Designation</option>
                                <option value="LPM">LPM</option>
                                <option value="LPP">LPP</option>
                                <option value="LPG">LPG</option>
                                <option value="SALP">SALP</option>
                                <option value="ALP">ALP</option>
                                <option value="CLI">CLI</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="hq"><HiOutlineBuildingOffice2/>Headquarters:</label>
                            <select className="form-control" id="hq" onChange={handleChange} required>
                                <option value="">Select your Division</option>
                                <option value="VSKP">VSKP</option>
                                <option value="GPL">GPL</option>
                                <option value="SCMN">SCMN</option>
                                <option value="MIPM">MIPM</option>
                                <option value="RGDA">RGDA</option>
                                <option value="KUR">KUR</option>
                                <option value="SBP">SBP</option>
                                <option value="TIG">TIG</option>
                                <option value="OTH">Others</option>
                            </select>
                        </div>
                    </>
                )}

                <div className="links-container">
                    {authType !== "signup" && <a href="/?authtype=signup">New User? (Click to Register here)</a>}
                    {authType !== "login" && <a href="/?authtype=login">Back to Login</a>}
                    {authType !== "reset-password" && <a href="/?authtype=reset-password">Forgot Password?(Click here)</a>}
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary ${fetching ? 'btn-disabled' : ''}`}
                    disabled={fetching}
                >
                    {fetching ? (
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress size="20px" sx={{ color: '#f2b157' }} />
                        </Box>
                    ) : (
                        authType === "signup" ? "Sign Up" : authType === "login" ? "Login" : authType === "signin" ? "Sign In" : "Reset Password"
                    )}
                </button>

                {
                    authType === "login" ?(
                        <div className="special-message">
                        <strong>Note:</strong> For the first time Aunthentication, use "123456" as password.
                        Don't forget to change the password later for the security of your account.
                        <br></br>
                        <span className="hindi">
                        <strong>नोट: </strong>पहली बार प्रमाणीकरण के लिए, "123456" को पासवर्ड के रूप में उपयोग करें।
                        बाद में अपने खाते की सुरक्षा के लिए पासवर्ड बदलना न भूलें।
                        </span>
                    </div>
                    ) : ("")
                }


                
            </form>
        </div>
        </div>
    );
};

const Page = ()=>{
    return(
        <Suspense fallback = {<div>Loading...</div>}>
            <PageCo/>
        </Suspense>
    )
}

export default Page;
