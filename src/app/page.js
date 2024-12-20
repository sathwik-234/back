"use client"
import React from 'react'
import "./styles/home.css"
import { useRouter } from 'next/navigation'

function page() {
    const nav = useRouter();
  return (
    <div className="home">
       <div className="middle">
               <div className="img-container">
                   <img src="/home-1.png"></img>
               </div>
               <div className="text-container">
                   <div className="Heading">
                       SIMHACHALAM-NORTH
                   </div>
                   <div className="context">
                           It is a "B" cateogry running room having  50 beds capacity located near to Gopalapatnam Railway Station.
                   </div>
                   <div className='signature-footer'>
                   <p>-done by <span className="author">"G.Pradeep Kumar"</span></p>
                   </div>
               </div>
           </div>
   </div>
)
}

export default page