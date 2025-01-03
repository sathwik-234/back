"use client";
import React, { useEffect, useState,useMemo } from "react";
import { Rating, TextField, Button, Box, Typography, Grid, Select, MenuItem } from "@mui/material";
import "./form2.css"
import { useRouter } from 'next/navigation';

function Page() {
    const nav = useRouter()

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const offset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const [refreshKey, setRefreshKey] = useState(0);

    const [formData, setFormData] = useState({
        cmsid: "",
        checkinId : "",
        name: "",
        design: "",
        hq: "",
        outTrainNo: "",
        outTime: formatDate(new Date()),
        allottedBed: "",
        breakfast : 0,
        lunch : 0,
        dinner : 0,
        parcel : 0,
        cleanliness: 0,
        food: 0,
        service: 0,
        comfort: 0,
        overall: 0,
    });

    const [cmsidOptions, setCmsidOptions] = useState([]);
    const [roomidOptions, setRoomidOptions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['bedSheets', 'pillowCover', 'blanket'].includes(name) && value < 0) {
            alert('Value cannot be negative');
            return;
        }
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRatingChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // const handleSubmit = ()=>{
    //     console.log(formData);
    //     alert(formData.cleanliness,formData.comfort);
    // }

    useEffect(() => {
        if (formData.cmsid) {
            // Fetch the data only if cmsid is present
            const fetchData = async () => {
                try {
                    const res = await fetch(`/api/CheckInSubmit/${formData.cmsid}`);
                    if (!res.ok) {
                        throw new Error(`Error fetching check-in data: ${res.statusText}`);
                    }
                    const data = await res.json();
                    console.log('CheckInSubmit data:', data);
    
                    if (data && data.data && data.data[0]?.id) {
                        setFormData((prevData) => ({
                            ...prevData,
                            checkinId: data.data[0].id,
                        }));
                    } else {
                        console.error('Invalid data format received from CheckInSubmit');
                    }
                } catch (err) {
                    console.error("Error fetching data:", err);
                }
            };
    
            fetchData();
        }
    }, [formData.cmsid]);  
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Fetch CheckOutSubmit API
            const response = await fetch('/api/CheckOutSubmit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const resp = await fetch(`/api/rooms/${formData.allottedBed}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'FALSE', allotted_to: null }),
            });
    
            const result1 = await response.json();
            const result2 = await resp.json();
    
            if (response.ok && resp.ok) {
                console.log('Form submitted successfully:', result1);
                alert('Form submitted successfully!');
            } else {
                console.error('Error submitting form:', response.ok ? result2 : result1);
                alert(`Error: ${(response.ok ? result2.error.message : result1.error.message) || 'Unexpected error'}`);
            }
    
        } catch (err) {
            console.error('Error during form submission:', err);
            alert(`Failed to submit: ${err.message}`);
        } finally {
            // Reset form
            setFormData({
                cmsid: '',
                name: '',
                design: '',
                hq: '',
                outTrainNo: '',
                outTime: '',
                allottedBed: '',
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
        }
    };
    


    // const resetForm = () => {
    //     setFormData({
    //         cmsid: "",
    //         name: "",
    //         design: "",
    //         hq: "",
    //         outTrainNo: "",
    //         outTime: formatDate(new Date()),
    //         allottedBed: "",
            
    //     });
    // };

    useEffect(() => {
        console.log(formData);
        console.log(roomidOptions)
        fetch("/api/user")
            .then((response) => response.json())
            .then((data) => {
                const options = data.data.map((item) => ({
                    id: item.id,
                    value: item.cms_id,
                    label: item.cms_id,
                }));
                setCmsidOptions([{ value: '', label: 'Select Cmsid', id: '' }, ...options]);
            })
            .catch((err) => {
                console.error("Error fetching CMSID options:", err);
            });

        fetch("/api/rooms_checkout")
            .then((response) => response.json())
            .then((data) => {
                const options = data.data.map((item) => ({
                    id: item.id,
                    value: item.room_no,
                    label: item.room_no,
                }));
                setRoomidOptions([{ value: '', label: 'Select Room', id: '' }, ...options]);
            })
            .catch((err) => {
                console.error("Error fetching Room options:", err);
            });
    }, [formData.allottedBed]);

    const selectedOption = useMemo(
        () => roomidOptions.find((option) => option.value === formData.allottedBed),
        [formData.allottedBed, roomidOptions]
    );

    useEffect(() => {
        console.log(2);
        if (selectedOption && selectedOption.id) {
            fetch(`/api/rooms_checkout/${selectedOption.id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.data[0])
                    if (data.data[0]) {
                        setFormData((prevData) => ({
                            ...prevData,  
                            cmsid: data.data[0].allotted_to,
                            name: data.data[0].Crew['crewname'] || '',
                            design: data.data[0].Crew['designation'] || '',
                            hq: data.data[0].Crew['hq'] || '',
                            outTrainNo:data.data.outTrainNo || '',
                            icTime: data.data.ic_time || '',
                            allottedBed: data.data.allottedBed || prevData.allottedBed,
                        }));
                    }
                })
                .catch((err) => {
                    console.error("Error fetching CMSID data:", err);
                });
        }
    }, [selectedOption]);

    return (
        <>
            <h1 className="form-name">Check Out Form</h1>
            <div className="form-block">
                <form onSubmit={handleSubmit}>
                        {/* Right Block */}
                        <div className="right-block">
                            <div>
                                <label>Allotted Bed:</label>
                                <select
                                    name="allottedBed"
                                    value={formData.allottedBed}
                                    onChange={handleChange}
                                >
                                    {roomidOptions.map((option) => (
                                        <option
                                            key={`${option.id}-${option.value}`}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>CMS Id:</label>
                                <input
                                    type="text"
                                    name="cmsid"
                                    value={formData.cmsid}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bead"
                                />
                            </div>
                            <div>
                                <label>Designation:</label>
                                <input
                                    type="text"
                                    name="design"
                                    value={formData.design}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>HeadQuarters:</label>
                                <input
                                    type="text"
                                    name="hq"
                                    value={formData.hq}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Left Block */}
                        <div className="left-block">
                            <div>
                                <label>Outgoing Time:</label>
                                <input
                                    type="datetime-local"
                                    name="outTime"
                                    value={formatDate(formData.outTime)}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Outgoing Train No.:</label>
                                <input
                                    type="text"
                                    name="outTrainNo"
                                    value={formData.outTrainNo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>BreakFast:</label>
                                <input type="number" name="breakfast" value={formData.breakfast} onChange={handleChange} min={0}></input>
                            </div>
                            <div>
                                <label>Lunch:</label>
                                <input type="number" name="lunch" value={formData.lunch} onChange={handleChange} min={0}></input>
                            </div>
                            <div>
                                <label>Dinner:</label>
                                <input type="number" name="dinner" value={formData.dinner} onChange={handleChange} min={0}></input>
                            </div>
                            <div>
                                <label>Parcel:</label>
                                <input type="number" name="parcel" value={formData.parcel} onChange={handleChange} min={0}></input>
                            </div>
                            
                        </div>
                <div className="feedback-block">
                    <Grid item xs={12}>
                        {["Cleanliness", "Food", "Service", "Comfort", "Overall"].map((field) => (
                            <Box key={field} sx={{ marginBottom: "15px" }}>
                                <Typography>{field}</Typography>
                                <Rating
                                    name={field.toLowerCase()}
                                    value={formData[field.toLowerCase()]}
                                    onChange={(event, value) =>
                                        handleRatingChange(field.toLowerCase(), value)
                                    }
                                />
                            </Box>
                        ))}
                    </Grid>
                </div>
                    <div className="button-div">
                        <button className="submitButton" type="submit">SUBMIT</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Page;
