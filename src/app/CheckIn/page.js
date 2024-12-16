"use client";
import React, { useEffect, useMemo, useState } from 'react';
import "./form1.css";

function Page() {
    const [formData, setFormData] = useState({
        cmsid: '',
        name: '',
        design: '',
        hq: '',
        icTrainNo: '',
        icTime: '',
        bedSheets: 2,
        pillowCover: 1,
        blanket: 1,
        allottedBed: '',
    });

    const [cmsidOptions, setCmsidOptions] = useState([
        { value: '', label: 'Select Cmsid', id: '' },
    ]);

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
                body: JSON.stringify({ status: 'TRUE',alloted_to : formData.cmsid }),
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
            alert('An unexpected error occurred.');
        } finally {
            setFormData({
                cmsid: '',
                name: '',
                design: '',
                hq: '',
                icTrainNo: '',
                icTime: '',
                bedSheets: 2,
                pillowCover: 1,
                blanket: 1,
                allottedBed: '',
            });
        }
    };

    useEffect(() => {
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
    }, []);

    const selectedOption = useMemo(
        () => cmsidOptions.find((option) => option.value === formData.cmsid),
        [formData.cmsid, cmsidOptions]
    );

    useEffect(() => {
        if (selectedOption && selectedOption.id) {
            fetch(`/api/user/${selectedOption.id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.data) {
                        setFormData((prevData) => ({
                            ...prevData,
                            cmsid: selectedOption.value,
                            name: data.data.crewname || '',
                            design: data.data.designation || '',
                            hq: data.data.hq || '',
                            icTrainNo: data.data.ic_train_no || '',
                            icTime: data.data.ic_time || '',
                            bedSheets: data.data.bed_sheets || prevData.bedSheets,
                            pillowCover: data.data.pillow_cover || prevData.pillowCover,
                            blanket: data.data.blanket || prevData.blanket,
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
            <h1 className="form-name">Check In Form</h1>
            <div className="form-block">
                <form onSubmit={handleSubmit}>
                    <div className="right-block">
                        <div>
                            <label>CMS Id:</label>
                            <select name="cmsid" value={formData.cmsid} onChange={handleChange}>
                                {cmsidOptions.map((option) => (
                                    <option key={`${option.id}-${option.value}`} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
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
                            <label>Incoming Train No:</label>
                            <input type="text" name="icTrainNo" value={formData.icTrainNo} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Incoming Time:</label>
                            <input type="datetime-local" name="icTime" value={formatDate(formData.icTime)} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Bed Sheets:</label>
                            <input type="number" name="bedSheets" value={formData.bedSheets} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Pillow Covers:</label>
                            <input type="number" name="pillowCover" value={formData.pillowCover} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Blankets:</label>
                            <input type="number" name="blanket" value={formData.blanket} onChange={handleChange} />
                        </div>

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
