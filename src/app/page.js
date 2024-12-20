"use client"
import React from 'react';
import "./home.css";
import { useRouter } from 'next/navigation';

const Page = () => {
    const nav = useRouter();

    return (
        <div className="home">
            <div className="middle">
                <div className="img-container">
                    <img src="/home-1.png" alt="Home"></img>
                </div>
                <div className="text-container">
                    <div className="Heading">
                        SIMHACHALAM-NORTH
                    </div>
                    <div className="context">
                        It is a "B" category running room having 50 beds capacity located near to Gopalapatnam Railway Station.
                    </div>
                    <br></br>
                    <br></br>
                    <div className="buttons-container">
                        <button 
                            className="button check-in" 
                            onClick={() => nav.push("/CheckIn")}
                        >
                            CheckIn
                        </button>
                        <button 
                            className="button check-out" 
                            onClick={() => nav.push("/CheckOut")}
                        >
                            CheckOut
                        </button>
                    </div>
                    <div className='signature-footer'>
                        <p>-done by <span className="author">"G.Pradeep Kumar"</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
