"use client";
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import "../CheckIn/form1.css";

function Page() {
    const [formData, setFormData] = useState({
        cmsid: '',
        name: '',
        design: '',
        hq: '',
        toTime : '',
        outTime: '',
        allottedBed: '',
    });

    const [cmsidOptions, setCmsidOptions] = useState([
        { value: '', label: 'Select Cmsid', id: '' },
    ]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/CheckInSubmit', {
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
                body: JSON.stringify({ status: 'TRUE',allotted_to : formData.cmsid }),
            });

            const result1 = await response.json();
            const result2 = await resp.json();

            if (response.ok && resp.ok) {
                console.log('Form submitted successfully:', result1);
                alert('Form submitted successfully!');
                setRefreshKey((prev)=>prev+1);
            } else {
                console.error('Error submitting form:', response.ok ? result2 : result1);
                alert(`Error: ${(response.ok ? result2.error.message : result1.error.message) || 'Unexpected error'}`);
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
                toTime:'',
                outTime: '',
                allottedBed: '',
            });
        }
    };

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

    // useEffect(()=>{
        
    //         .then((response)=>response.json())
    //         .then((data)=>console.log(data))
    //         .catch((err)=>console.log(err));
    // },[formData.allottedBed])

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
                            toTime:data.data.toTime || '',
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

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    };

    return (
        <>
            <h1 className="form-name">Check Out Form</h1>
            <div className="form-block">
                <form onSubmit={handleSubmit}>
                    <div className="right-block">
                    <div>
                            <label>Allotted Bed:</label>
                            <select name="allottedBed" value={formData.allottedBed} onChange={handleChange}>
                                {roomidOptions.map((option) => (
                                    <option key={`${option.id}-${option.value}`} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>CMS Id:</label>
                            {/* <select name="cmsid" value={formData.cmsid} onChange={handleChange}>
                                {cmsidOptions.map((option) => (
                                    <option key={`${option.id}-${option.value}`} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select> */}
                            <input type='text' name='cmsid' value={formData.cmsid} onChange={handleChange}></input>
                        </div>

                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Designation:</label>
                            <input type="text" name="design" value={formData.design} onChange={handleChange} />
                        </div>

                        <div>
                            <label>HeadQuarters:</label>
                            <input type="text" name="hq" value={formData.hq} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="left-block">

                        <div>
                            <label>TO Time:</label>
                            <input type="datetime-local" name="toTime" value={formatDate(formData.toTime)} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Outgoing Time:</label>
                            <input type="datetime-local" name="outTime" value={formatDate(formData.outTime)} onChange={handleChange} />
                        </div>

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
