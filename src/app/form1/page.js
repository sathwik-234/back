"use client"
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
        { value: '', label: 'Select Cmsid' },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        // Add your submit logic here
    };

    useEffect(() => {
        fetch("/api/user")
            .then((response) => response.json())
            .then((data) => {
                const options = data.data.map((item) => ({
                    value: item.cms_id,
                    label: item.cms_id,
                }));
                setCmsidOptions([{ value: '', label: 'Select Cmsid' }, ...options]);
                
            })
            .catch((err) => {
                console.log(err);
            });
    }, []); // Fetch data only once on component mount

    return (
        <>
            <h1 className='form-name'>Check In Form</h1>
            <div className="form-block">
                <form>
                    <div className="right-block">
                        <div>
                            <label>Cmsid:</label>
                            <select name="cmsid" value={formData.cmsid} onChange={handleChange}>
                                {cmsidOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
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
                </form>
            </div>
            <div className='button-div'>
                <button className="submitButton" onClick={handleSubmit}>SUBMIT</button>
            </div>
        </>
    );
}

export default Page;
