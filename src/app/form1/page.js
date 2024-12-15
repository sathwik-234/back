"use client";
import React, { useEffect, useState } from 'react';
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
        
                const result = await response.json();
                if (response.ok) {
                    console.log('Form submitted successfully:', result);
                    alert('Form submitted successfully!');
                } else {
                    console.error('Error submitting form:', result);
                    alert(`Error: ${result.error.message}`);
                }
            } catch (err) {
                console.error('Error during form submission:', err);
                alert('An unexpected error occurred.');
            }
            console.log('Form Data Submitted:', formData);
        }; 
        

    // Fetch CMSID options on mount
    useEffect(() => {
        fetch("/api/user")
            .then((response) => response.json())
            .then((data) => {
                const options = data.data.map((item) => ({
                    id: item.id,
                    value: item.cms_id,
                    label: item.cms_id,
                }));
                setCmsidOptions([{ value: '', label: 'Select Cmsid', id: "" }, ...options]);
            })
            .catch((err) => {
                console.error("Error fetching CMSID options:", err);
            });
    }, []);

    // Fetch data dynamically when cmsid changes
    useEffect(() => {
        const selectedOption = cmsidOptions.find((option) => option.value === formData.cmsid);

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
                            allottedBed: data.data.allotted_bed || '',
                        }));
                    }
                })
                .catch((err) => {
                    console.error("Error fetching CMSID data:", err);
                });
        }
    }, [formData.cmsid, cmsidOptions]);

    return (
        <>
            <h1 className="form-name">Check In Form</h1>
            <div className="form-block">
                <form onSubmit={handleSubmit}>
                    <div className="right-block">
                        <div>
                            <label>Cmsid:</label>
                            <select name="cmsid" value={formData.cmsid} onChange={handleChange}>
                                {cmsidOptions.map((option) => (
                                    <option key={option.id} value={option.value}>
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
                            <label>Design:</label>
                            <input type="text" name="design" value={formData.design} onChange={handleChange} />
                        </div>

                        <div>
                            <label>HQ:</label>
                            <input type="text" name="hq" value={formData.hq} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="left-block">
                        <div>
                            <label>IC Train No:</label>
                            <input type="text" name="icTrainNo" value={formData.icTrainNo} onChange={handleChange} />
                        </div>
                        <div>
                            <label>IC Time:</label>
                            <input type="datetime-local" name="icTime" value={formData.icTime} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Bed Sheets:</label>
                            <input type="number" name="bedSheets" value={formData.bedSheets} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Pillow Cover:</label>
                            <input type="number" name="pillowCover" value={formData.pillowCover} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Blanket:</label>
                            <input type="number" name="blanket" value={formData.blanket} onChange={handleChange} />
                        </div>

                        <div>
                            <label>Allotted Bed:</label>
                            <input type="text" name="allottedBed" value={formData.allottedBed} onChange={handleChange} />
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
