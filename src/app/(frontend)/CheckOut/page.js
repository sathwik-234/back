"use client";
import React, { useEffect, useState } from "react";
import { Rating, Typography, Box, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import "./form2.css";
import { signout } from "@/utils/actions";

function CheckOut() {
  const nav = useRouter();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d - offset);
    return localDate.toISOString().slice(0, 16);
  };

  const [verified, setVerified] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [formData, setFormData] = useState({
    cmsid: "",
    checkinId: "",
    name: "",
    design: "",
    hq: "",
    outTrainNo: "",
    outTime: formatDate(new Date()),
    allottedBed: "",
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    parcel: 0,
    cleanliness: 0,
    food: 0,
    service: 0,
    comfort: 0,
    overall: 0,
  });

  useEffect(() => {
    fetch("/api/auth")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch user authentication.");
        return response.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [refreshKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["bedSheets", "pillowCover", "blanket"].includes(name) && value < 0) {
      alert("Value cannot be negative");
      return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRatingChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/getCrewDetails/${user.email}`);
          if (!res.ok) throw new Error(`Error fetching crew details: ${res.statusText}`);
          const data = await res.json();

          if (data?.data?.cms_id) {
            setFormData((prevData) => ({
              ...prevData,
              cmsid: data.data.cms_id,
              name: data.data.crewname,
              design: data.data.designation,
              hq: data.data.hq,
            }));
          } else {
            throw new Error("Invalid data format received from crew details API.");
          }
        } catch (err) {
          setError(err.message);
        }
      };

      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (formData.cmsid) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/CheckInSubmit/${formData.cmsid}`);
          if (!res.ok) throw new Error(`Error fetching room data: ${res.statusText}`);
          const data = await res.json();

          if (data?.data?.[0]?.allotted_bed) {
            setFormData((prevData) => ({
              ...prevData,
              checkinId: data.data[0].id,
              allottedBed: data.data[0].allotted_bed,
            }));
          } else {
            throw new Error("Invalid room data format.");
          }
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [formData.cmsid]);

  useEffect(() => {
  fetch(`/api/rooms/${formData.allottedBed}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
      if(data.data.status === "FALSE"){
          alert("Room is already checked out.");
          setVerified(false);
      }else{
          setVerified(true);
      }
  })
  .catch((err) => {
      setError(err.message);
  })},[formData.allottedBed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
        if(verified){
            const response = await fetch("/api/CheckOutSubmit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              });
        
              const resp = await fetch(`/api/rooms/${formData.allottedBed}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "FALSE", allotted_to: null }),
              });
        
              if (!response.ok || !resp.ok) {
                throw new Error(`Error during submission: ${response.ok ? resp.statusText : response.statusText}`);
              }
        
              alert("Form submitted successfully!");
              setFormData({
                cmsid: "",
                name: "",
                design: "",
                hq: "",
                outTrainNo: "",
                outTime: "",
                allottedBed: "",
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                parcel: 0,
                cleanliness: 0,
                food: 0,
                service: 0,
                comfort: 0,
                overall: 0,
              });
              nav.push("/home");
            }else{
                alert("checkout form already submitted,Checkin First ");
                setButtonDisabled(false);
                signout();
                nav.push("/");
            }
        } catch (err) {
            setError(err.message);
          }finally{
              setButtonDisabled(false);
              signout();
              nav.push("/");
          }
  };

  if (loading)
    return (
      <div className="home-loading">
        <Box sx={{ display: "flex" }}>
          <CircularProgress size="50px" sx={{ color: "#54473F" }} />
        </Box>
      </div>
    );

  if (error)
    return (
      <div className="error">
        <Typography color="error">{error}</Typography>
      </div>
    );

  return (
    <>
      <h1 className="checkout-form-name">CheckOut Form</h1>
      <div className="checkout-form-block">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="right-block">
          <div className="form-field">
                                <label className="field-label">Allotted Bed:</label>
                                <input type="text" name="allottedBed" value={formData.allottedBed} onChange={handleChange} className="form-input" readOnly />
                            </div>
                            <div className="form-field">
                                <label className="field-label">CMS Id:</label>
                                <input
                                    type="text"
                                    name="cmsid"
                                    value={formData.cmsid}
                                    onChange={handleChange}
                                    className="form-input"
                                    readOnly
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input bead"
                                    readOnly
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Designation:</label>
                                <input
                                    type="text"
                                    name="design"
                                    value={formData.design}
                                    onChange={handleChange}
                                    className="form-input"
                                    readOnly
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">HeadQuarters:</label>
                                <input
                                    type="text"
                                    name="hq"
                                    value={formData.hq}
                                    onChange={handleChange}
                                    className="form-input"
                                    readOnly
                                />
                            </div>
          </div>
          <div className="left-block">
          <div className="form-field">
                                <label className="field-label">Outgoing Time:</label>
                                <input
                                    type="datetime-local"
                                    name="outTime"
                                    value={formatDate(formData.outTime)}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Outgoing Train No.:</label>
                                <input
                                    type="text"
                                    name="outTrainNo"
                                    value={formData.outTrainNo}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">BreakFast:</label>
                                <input
                                    type="number"
                                    name="breakfast"
                                    value={formData.breakfast}
                                    onChange={handleChange}
                                    min={0}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Lunch:</label>
                                <input
                                    type="number"
                                    name="lunch"
                                    value={formData.lunch}
                                    onChange={handleChange}
                                    min={0}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Dinner:</label>
                                <input
                                    type="number"
                                    name="dinner"
                                    value={formData.dinner}
                                    onChange={handleChange}
                                    min={0}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Parcel:</label>
                                <input
                                    type="number"
                                    name="parcel"
                                    value={formData.parcel}
                                    onChange={handleChange}
                                    min={0}
                                    className="form-input"
                                    required
                                />
                            </div>
          </div>
          <div className="feedback-block">
            <Grid item xs={12}>
              {["Cleanliness", "Food", "Service", "Comfort", "Overall"].map((field) => (
                <Box key={field} sx={{ marginBottom: "15px" }}>
                  <Typography className="field-label">{field}</Typography>
                  <Rating
  name={field.toLowerCase()}
  value={formData[field.toLowerCase()]}
  onChange={(event, value) => handleRatingChange(field.toLowerCase(), value)}
  sx={{
    '& .MuiRating-iconFilled': {
      color: '#f0910c', 
      textShadow: '0 0 10px rgba(236, 253, 2, 0.8)', 
    },
    '& .MuiRating-iconHover': {
      color: '#f0910c', 
      textShadow: '0 0 10px rgba(236, 253, 2, 0.8)', 
    }
  }}
/>

                </Box>
              ))}
            </Grid>
          </div>
          <div className="button-div">
            <button className="submitButton" type="submit">
                                    { buttonDisabled ? (
                                                        <Box sx={{ display: 'flex' }}>
                                                        <CircularProgress size="20px" sx={{ color: '#f2b157' }} />
                                                        </Box>
                                            ) : ("Submit")}
        </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CheckOut;
