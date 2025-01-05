"use client";
import React, { useEffect, useMemo, useState } from 'react';
import "./form1.css"
import { useRouter } from 'next/navigation';
import { useEmail } from '@/app/contexts/EmailContext';
import { signout } from '@/utils/actions';
import { Box, CircularProgress } from '@mui/material';

function CheckIn() {
    const nav = useRouter();
    
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const offset = d.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localDate = new Date(d - offset); // Adjust to local timezone
        return localDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
    };

    const [formData, setFormData] = useState({
        cmsid: '',
        name: '',
        design: '',
        hq: '',
        icTrainNo: '',
        icTime: formatDate(new Date()),
        bedSheets: 2,
        pillowCover: 1,
        blanket: 1,
        allottedBed: '',
        arrTime : ''
    });

    const [user,setUser] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [verified,setVerified] = useState(false)

    const [refreshKey, setRefreshKey] = useState(0);

    const [roomidOptions, setRoomidOptions] = useState([
        { value: '', label: 'Select Room', id: '' },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['bedSheets', 'pillowCover', 'blanket'].includes(name) && value < 0) {
            alert('Value cannot be negative');
            return;
        }
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        if (user) {
          fetch(`/api/getCrewDetails/${user.email}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
              setFormData((prevData) => ({
                ...prevData,
                cmsid: data.data.cms_id || '',
                name: data.data.crewname || '',
                design: data.data.designation || '',
                hq: data.data.hq || '',
              }));
              setLoading(false);
            })
            .catch(() => {
              setError(true);
              setLoading(false);
            });
        }
      }, [user]);


      useEffect(() => {
    
        const fetchData = async () => {
            try {
                const response = await fetch(`api/CheckInSubmit/${formData.cmsid}`);
                if (!response.ok) throw new Error(`Error fetching cms data: ${response.statusText}`);
                
                const check_in_data = await response.json();
                const res = await fetch(`api/rooms/${check_in_data.data[0].allotted_bed}`);
                if (!res.ok) throw new Error(`Error fetching room data: ${res.statusText}`);
                
                const roomData = await res.json();
                    if (roomData.data[0].allotted_to === formData.cmsid) {
                        console.log("Already checkedIn");
                        setVerified(false);
                        alert("Already checked in")
                        signout();
                        nav.push("/")
                    } else {
                        console.log("New User");
                        setVerified(true);
                    }
                console.log(verified)
            } catch (error) {
                if (isMounted) console.error(error.message);
            }
        };
    
        if (formData.cmsid) fetchData(); 
    }, [formData.cmsid]);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);
        console.log(verified)
        try {
            if (verified) {
                // First request to submit the form data
                const response = await fetch('/api/CheckInSubmit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                // Second request to update room status
                const resp = await fetch(`/api/rooms/${formData.allottedBed}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'TRUE', allotted_to: formData.cmsid }),
                });
    
                // Awaiting both responses
                const result1 = await response.json();
                const result2 = await resp.json();
    
                if (response.ok && resp.ok) {
                    console.log('Form submitted successfully:', result1);
                    alert('Form submitted successfully!');
                    setRefreshKey((prev) => prev + 1);
                } else {
                    const errorMessage = response.ok ? result2.error.message : result1.error.message;
                    console.error('Error submitting form:', errorMessage);
                    alert(`Error: ${errorMessage || 'Unexpected error'}`);
                }
            }
        } catch (err) {
            console.error('Error during form submission:', err);
            alert('An unexpected error occurred.');
        } finally {
            // Reset form data and re-enable button
            setFormData({
                cmsid: '',
                name: '',
                design: '',
                hq: '',
                icTrainNo: '',
                icTime: formatDate(new Date()),
                bedSheets: 2,
                pillowCover: 1,
                blanket: 1,
                allottedBed: '',
            });
            setButtonDisabled(false);
    
            // Signout and redirect
            signout();
            nav.push('/');
        }
    };
    

    useEffect(() => {
        setLoading(true);  // Set loading state before making fetch request
        
        fetch("/api/auth")
            .then((res) => res.json())
            .then((data) => {
                setUser(data.user);
                setLoading(false);  // Set loading to false once data is received
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
        
        fetch("/api/rooms")
            .then((response) => response.json())
            .then((data) => {
                const options = data.data.map((item) => ({
                    id: item.id,
                    value: item.room_no,
                    label: item.room_no,
                }));
                setRoomidOptions([{ value: '', label: 'Select Room', id: '' }, ...options]);
                setLoading(false);  // Set loading to false once room data is fetched
            })
            .catch((err) => {
                console.error("Error fetching Room options:", err);
                setLoading(false);  // Make sure to set loading to false if fetch fails
            });
    }, [refreshKey]);
    

    if (loading) return (
        <div className="checkin-loading">
          <Box sx={{ display: 'flex' }}>
            <CircularProgress size="50px" sx={{ color: '#54473F' }} />
          </Box>
        </div>
      );
    
      if (error) return <div className="error">An error occurred. Please try again later.</div>;

    
            
        

    // const formatDate = (date) => {
    //     if (!date) return '';
    //     const d = new Date(date);
    //     return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    // };

    return (
        <div className='hifi'>
            <h1 className="checkin-form-name">Check In Form</h1>
            <div className="form-block">
                <form onSubmit={handleSubmit} className='check-form'>
                    <div className="right-block">
                        <div className="form-field">
                            <label htmlFor="cmsid" className="label">CMS Id:</label>
                            <input type="text" name="cmsid" value={formData.cmsid} onChange={handleChange} className="input-text" readOnly/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="name" className="label">Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-text bead" readOnly/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="design" className="label">Designation:</label>
                            <input type="text" name="design" value={formData.design} onChange={handleChange} className="input-text" readOnly/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="hq" className="label">HeadQuarters:</label>
                            <input type="text" name="hq" value={formData.hq} onChange={handleChange} className="input-text" readOnly/>
                        </div>
                    </div>

                    <div className="left-block">
                        <div className="form-field">
                            <label htmlFor="vzm_arr_time" className="label">VZM. Arrival Time</label>
                            <input type="datetime-local" name="arrTime" value={formData.arrTime} onChange={handleChange} className="input-datetime" required/>
                        </div>
                        <div className="form-field">
                            <label htmlFor="icTrainNo" className="label">Incoming Train No:</label>
                            <input type="text" name="icTrainNo" value={formData.icTrainNo} onChange={handleChange} className="input-text" required/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="icTime" className="label">RuningRoom Arrival Time:</label>
                            <input type="datetime-local" name="icTime" value={formData.icTime} onChange={handleChange} className="input-datetime" required/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="allottedBed" className="label">Allotted Bed:</label>
                            <select name="allottedBed" value={formData.allottedBed} onChange={handleChange} className="input-select" required>
                                {roomidOptions.map((option) => (
                                    <option key={`${option.id}-${option.value}`} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='feedback-block'>
                        <div className="form-field">
                            <label htmlFor="bedSheets" className="label">Bed Sheets:</label>
                            <input type="number" name="bedSheets" value={formData.bedSheets} onChange={handleChange} className="input-number" required/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="pillowCover" className="label">Pillow Covers:</label>
                            <input type="number" name="pillowCover" value={formData.pillowCover} onChange={handleChange} className="input-number" required/>
                        </div>

                        <div className="form-field">
                            <label htmlFor="blanket" className="label">Blankets:</label>
                            <input type="number" name="blanket" value={formData.blanket} onChange={handleChange} className="input-number" required/>
                        </div>
                    </div>

                    {/* <div className="button-div" disabled={buttonDisabled}>
                        <button className="submitButton" type="submit">SUBMIT</button>
                    </div> */}

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
        </div>

    );
}

export default CheckIn;
