"use client";
import React, { useEffect, useState, useRef } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import './main.css';

const Page = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [formData, setFormData] = useState({
    crewname: "",
    cms_id: "",
    email: "",
    date: "",
    meal: "Breakfast",
  });
  const [tokenNumber, setTokenNumber] = useState(""); 

  const contentRef = useRef(null); // Ref for the hidden receipt content

  const printfn = useReactToPrint({ contentRef});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/TokenSubmission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      console.log(result.tokenNumber);
      if (res.ok) {
        setTokenNumber(result.tokenNumber);
        setTimeout(() => {
          printfn();
        }, 100); 
      }
      else {
        console.error("Error:", result.message);
      }}
      catch (err) {
        console.error("Error submitting form data:", err);
    } 
    };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const now = new Date();
    const istOffset = 5.5 * 60;
    const istTime = new Date(now.getTime() + istOffset * 60000);
    const formattedIST = istTime.toISOString().slice(0, 16);
    setCurrentDateTime(formattedIST);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth");
        const result = await res.json();
        setUser(result.user);
      } catch (err) {
        setError(true);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchCrewDetails = async () => {
        try {
          const res = await fetch(`/api/getCrewDetails/${user.email}`);
          const result = await res.json();
          setData(result);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchCrewDetails();
    }
  }, [user]);
  
  useEffect(() => {
    if (data?.data) {
      setFormData((prev) => ({
        ...prev,
        crewname: data.data.crewname || "",
        cms_id: data.data.cms_id || "",
        email: data.data.email || "",
        date: currentDateTime,
        meal: "Breakfast",
      }));
    }
  }, [data, currentDateTime]);
  

  if (loading) {
    return (
      <div className="slips-loading">
        <Box sx={{ display: 'flex' }}>
          <CircularProgress size="50px" sx={{ color: '#54473F' }} />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slips-loading">
        <div className="main-container">
          <div className="slips-container">
            <h1 className="slips-title">Error</h1>
            <div className="slips-content">
              <p>Something went wrong. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="slips-container">
        <h1 className="slips-title">Meal Tokens</h1>
        <div className="slips-content">
          <form className="slips-form">
            <div className="slip-form-field">
              <label>Name:</label>
              <input
                className="slips-input"
                type="text"
                name="crewname"
                value={formData.crewname || data?.data?.crewname || ""}
                onChange={handleChange}
              />
            </div>

            <div className="slip-form-field">
              <label>CMS ID:</label>
              <input
                className="slips-input"
                type="text"
                name="cms_id"
                value={formData.cms_id || data?.data?.cms_id || ""}
                onChange={handleChange}
              />
            </div>

            <div className="slip-form-field">
              <label>Email:</label>
              <input
                className="slips-input"
                type="text"
                name="email"
                value={formData.email || data?.data?.email || ""}
                onChange={handleChange}
              />
            </div>

            <div className="slip-form-field">
              <label>Date:</label>
              <input
                className="slips-input"
                type="datetime-local"
                name="date"
                value={formData.date || currentDateTime}
                onChange={handleChange}
              />
            </div>

            <div className="slip-form-field">
              <label>Meal:</label>
              <select
                className="slips-input"
                name="meal"
                value={formData.meal}
                onChange={handleChange}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
          </form>
        </div>

        <button
          onClick={handleSubmit}
          className="slips-button"
        >
          Print
        </button>

        <div ref={contentRef} className="hidden-for-print" >
          <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center" }}>AR Royal Fort</h1>
            <h2>Beside of VZM fort</h2>
            <h2>Vizianagaram-535004-Andhra Pradesh</h2>
            <h2>Meal Token</h2>
            <p>
              <strong>Token Number:</strong> {tokenNumber}
            </p>
            <p>
              <strong>Name:</strong> {formData.crewname || data?.data?.crewname}
            </p>
            <p>
              <strong>CMS ID:</strong> {formData.cms_id || data?.data?.cms_id}
            </p>
            <p>
              <strong>Date:</strong> {formData.date || currentDateTime}
            </p>
            <p>
              <strong>Meal:</strong> {formData.meal}
            </p>
            <hr />
            <p style={{ textAlign: "center" }}>Thank you for choosing our service!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
