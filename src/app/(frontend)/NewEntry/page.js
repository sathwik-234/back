"use client";
import React, { useEffect, useState } from 'react';
import "./form2.css";

function page() {
    const [formData, setFormData] = useState({
        cmsid: '',
        name: '',
        design: '',
        hq: '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Optional: form validation
        if (!formData.cmsid || !formData.name || !formData.design || !formData.hq) {
            alert("All fields are required!");
            return;
        }
        
        try {
            const response = await fetch('/api/NewEntrySubmit', {
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
                setFormData({
                    cmsid: '',
                    name: '',
                    design: '',
                    hq: '',
                });
            } else {
                console.error('Error submitting form:', result);
                alert(`Error: ${result.error.message}`);
                
            }
        } catch (err) {
            console.error('Error during form submission:', err);
            alert('There is already a CMS ID with the submitted ID');
            setFormData({
                cmsid: '',
                name: '',
                design: '',
                hq: '',
            })
        }
    };

    return (
        <>
            <h1 className="form-name">New CMS-ID Form</h1>
            <div className="form-block">
                <form onSubmit={handleSubmit}>
                    <div className="right-block">
                        <div>
                            <label>CMS Id:</label>
                            <input type='text' name="cmsid" value={formData.cmsid} onChange={handleChange} />
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

                    <div className="button-div">
                        <button className="submitButton" type="submit">SUBMIT</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default page;
