"use client";
import React, { useState, useEffect } from "react";
import './main.css';
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { signout } from "@/utils/actions";
import { PiSignOutBold } from "react-icons/pi";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { MdLocalHotel } from "react-icons/md";
import { IoFastFoodSharp } from "react-icons/io5";


const Page = () => {
  const nav = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setLoading(true);  // Set loading to true initially
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);  // Ensure loading is set to false once data is fetched
      })
      .catch(() => {
        setError(true);
        setLoading(false);  // Set loading to false on error
      });
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);  // Set loading to true when fetching data
      fetch(`/api/getCrewDetails/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);  // Set loading to false after data is fetched
        })
        .catch(() => {
          setError(true);
          setLoading(false);  // Set loading to false on error
        });
    }
  }, [user]);
  

  const handleSignOut = async () => {
    setFetching(true);
    await signout();
    nav.push("/");
    setFetching(false);
  }

  if (loading) return (
    <div className="home-loading">
      <Box sx={{ display: 'flex' }}>
        <CircularProgress size="50px" sx={{ color: '#54473F' }} />
      </Box>
    </div>
  );

  if (error) return <div className="error">An error occurred. Please try again later.</div>;

  return (
    <div className="home-mini-container">
      <div className="home-container">
        <div className="home-left-section">
          <div className="image-logo">
            <img src="/home-1.png" alt="Simhachalam North Logo" />
          </div>
          <div className="home-heading">
            <h1>VIZIANAGARAM RUNNING ROOM</h1>
          </div>
        </div>
        <div className="home-text-container">
          <div className="Heading">Welcome {data ? '"'+ data.data.crewname + '"' + "🙏" : "Guest"}</div>
          <div className="home-sub-heading">Enjoy your Stay😊</div>
          <div className="home-buttons-container">
            <button
              className="home-button check-in"
              onClick={() => nav.push("/CheckIn")}
            >
             <MdLocalHotel style={{ marginRight: '8px' }} /> {/* Icon */}
              CheckIn
            </button>
            <button
              className="home-button meal-token"
              onClick={() => nav.push("/Slips")}
            >
               <IoFastFoodSharp style={{ marginRight: '8px' }} /> {/* Icon */}
             Meal Token 
            </button>
            <button
              className="home-button check-out"
              onClick={() => nav.push("/CheckOut")}
            >
               <FaPersonWalkingLuggage style={{ marginRight: '8px' }} /> {/* Icon */}
              CheckOut
            </button>
            
          </div>
          <div className="home-buttons-container">
            <button
              onClick={handleSignOut}
              disabled={fetching}
              className="home-button sign-out"
            >
              {fetching ? (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress size="20px" sx={{ color: '#f2b157' }} />
                </Box>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <PiSignOutBold style={{ marginRight: '8px' }} /> {/* Icon */}
                  <span>Sign Out</span> {/* Text */}
                </div>
              )}

              
            </button>
          </div>
          <div className="signature-footer">
            <p>
              - Designed & Developed by{" "}
              <span className="author">G.Pradeep Kumar & G.Sai Sathwik</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
