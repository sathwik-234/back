"use client"
import React, { useEffect, useState,useMemo } from 'react'
import "./form3.css"
import { useRouter } from 'next/navigation'
import { CircularProgress, Box } from '@mui/material';


function page() {
    const nav = useRouter();

    const [formData,setFormData] = useState(
        {
            cmsid: '',
            name: '',
            design: '',
            hq: '',
            roomno:'',
            complaintType : '',
            description : ''
        }
    )

    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);
    
    useEffect(() => {
            fetch("/api/auth")
                .then((res) => res.json())
                .then((data) => {
                    setUser(data.user);
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
                })
                .catch((err) => {
                    console.error("Error fetching Room options:", err);
                });
        }, [refreshKey]);
    



    const handleChange = (e) => {
        const { name, value } = e.target;
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




        const handleSubmit = async (e) => {
            e.preventDefault();
            setButtonDisabled(true);
            try {
                const response = await fetch('/api/complaint', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                const result1 = await response.json();
    
                if (response.ok) {
                    console.log('Form submitted successfully:', result1);
                    alert('Form submitted successfully!');
                    setRefreshKey((prev)=>prev+1);
                } else {
                    console.error('Error submitting form:', response.ok ? result2 : result1);
                    alert(`Error:  'Unexpected error'`);
                }
            } catch (err) {
                console.error('Error during form submission:', err);
                alert('An unexpected error occurred.');
            } finally {
                setFormData({
                    cmsid: '',
                    name: '',
                    design: '',
                    hq: '',
                    roomno:'',
                    complaintType : '',
                    description : ''
                });
                setButtonDisabled(false);
                nav.push("/home")
            }
        };

        if (loading) return (
            <div className="about-us-loading">
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size="50px" sx={{ color: '#54473F' }} />
              </Box>
            </div>
          );
        
          if (error) return <div className="error">An error occurred. Please try again later.</div>;
    
        



  return (
    <>
        <h1 className="form-title">Complaint Form</h1>
            <div className="form-container">
                <form className="form-element" onSubmit={handleSubmit}>
                    <div className="form-column-right">
                        <div className="input-group">
                            <label className='help-form-label'>CMS Id:</label>
                            <input type="text" name="cmsid" value={formData.cmsid} onChange={handleChange} className='help-form-input' />
                        </div>

                        <div className="input-group">
                            <label className='help-form-label'>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className='help-form-input' />
                        </div>

                        <div className="input-group">
                            <label className='help-form-label'>Designation:</label>
                            <input type="text" name="design" value={formData.design} onChange={handleChange} className='help-form-input' />
                        </div>

                        <div className="input-group">
                            <label className='help-form-label'>HeadQuarters:</label>
                            <input type="text" name="hq" value={formData.hq} onChange={handleChange} className='help-form-input' />
                        </div>
                    </div>

                    <div className="form-column-left">
                    <div className="input-group">
                            <label className='help-form-label'>Room No.:</label>
                            <input type="text" name="roomno" value={formData.roomno} onChange={handleChange} className='help-form-room' required/>
                        </div>
                        <div className="input-group">
    <label className='help-form-label'>Nature Of Complaint:</label>
    <select 
        name="complaintType" 
        value={formData.complaintType} 
        onChange={handleChange} 
        className="special-input" 
        required
    >
        <option value="" disabled>Select a complaint type</option>
        <option value="room not cleaned">Room Not Cleaned</option>
        <option value="stale food served">Stale Food Served</option>
        <option value="poor food quality in parcel">Poor Food quality in parcel</option>
        <option value="uncomfortable in bedding">Uncomfortable in Bedding</option>
        <option value="unclean toilets">Unclean Toilets</option>
        <option value="no proper hospitality">No Proper Hospitality</option>
        <option value="others">Others</option>
    </select>
</div>

                        <div className="input-group">
                            <label className='help-form-label'>Description:</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} maxLength={200} placeholder="Up to 200 words" className="textarea-resizable" />
                        </div>
                    </div>

                    <div className="form-button-container">
                        <button className="submit-button" type="submit">
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
  )
}

export default page