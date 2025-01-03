"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./styles/home.css";
import { sendResetPasswordEmail, signinWithEmailPassword, signout, signupWithEmailPassword } from "@/utils/actions";
import { Box, CircularProgress } from "@mui/material";
import { display } from "@mui/system";

const Page = () => {
    const searchParams = useSearchParams();
    const nav = useRouter();
    const authType = searchParams.get("authtype") || "login";
    
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
                    alert("Sign-up successful! Check your email for verification.");
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
                        alert("Login successful!");
                        nav.push("/ThankYou");
                    } else {
                        if(data.email){
                            alert("Wrong Password!!(U can reset password by clicking forgot password")
                        }else{
                            alert("User not authenticated")
                            nav.push("/?authtype=signin")
                        }
                    }
                } else {
                    alert("CMS ID not found.");
                    nav.push("/?authtype=signup")
                }
            } else if (authType === "reset-password") {
                const response = await fetch(`/api/users/${formData.cms_id}`);
                if (response.ok) {
                    const { data } = await response.json();
                    const { success } = await sendResetPasswordEmail({ email: data.email });
                    if (success) {
                        alert("Password reset email sent!");
                        nav.push("/?authtype=login");
                    }
                    else{
                        if(data.email){
                            alert("There is an Error Occured,Wait for 2 min, then make a submit again")
                        }else{
                            alert("User not authenticated");
                            nav.push("/?authtype=signin")
                        }
                    }
                } else {
                    alert("CMS ID not found.");
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
                        alert("Check your mail for verification before login")
                        nav.push("/?authtype=login");
                    }else{
                        alert("An error occures")
                    }
                }else{
                    alert("CMS ID is not found")
                    nav.push("/?authtype=signup")
                }
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("Something went wrong. Please try again later.");
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
        <Suspense fallback={<div>Loading...</div>}>
            <div className="container">
            <div>
                <form action={signout}>
                    <button type="submit">Sign Out</button>
                </form>
            </div>
            <div className="left-section">
                <div className="image-logo">
                    <img src="/home-1.png" alt="logo" />
                </div>
                <div className="heading">
                    <h1>East Coast Railway</h1>
                </div>
                <div className="sub-heading">
                    <h2>Running Room Governance</h2>
                </div>
                <div className="sub-heading">
                    <h2>Waltair Division-VSKP</h2>
                </div>
                <div className="sub-heading">
                    <h2>Vizianagaram Jn.</h2>
                </div>
            </div>

            <form className="right-section" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cms_id">CMS ID:</label>
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
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your 6 digit Password"
                            onChange={handleChange}
                            required
                        />
                        {passwordError && <span className="error-message">{passwordError}</span>}
                    </div>
                )}

                {authType === "signin" && (
                    <>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
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
                            <label htmlFor="email">Email:</label>
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
                            <label htmlFor="crewname">Crew Name:</label>
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
                            <label htmlFor="designation">Designation:</label>
                            <select className="form-control" id="designation" onChange={handleChange} required>
                                <option value="">Select your Designation</option>
                                <option value="LPM">LPM</option>
                                <option value="LPP">LPP</option>
                                <option value="LPG">LPG</option>
                                <option value="ALP">ALP</option>
                                <option value="SALP">SALP</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="hq">Headquarters:</label>
                            <select className="form-control" id="hq" onChange={handleChange} required>
                                <option value="">Select your Division</option>
                                <option value="VSKP">VSKP</option>
                                <option value="KUR">KUR</option>
                                <option value="SCMN">SCMN</option>
                                <option value="MIPM">MIPM</option>
                                <option value="RGDA">RGDA</option>
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
                    {authType !== "reset-password" && <a href="/?authtype=reset-password">Forgot Password?(CLick here)</a>}
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



                
            </form>
        </div>
        </Suspense>
    );
};

export default Page;
