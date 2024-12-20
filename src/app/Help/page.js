"use client"
import React, { useEffect, useState,useMemo } from 'react'
import './form3.css'
import { useRouter } from 'next/navigation'



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

    const [refreshKey, setRefreshKey] = useState(0);

    const [cmsidOptions, setCmsidOptions] = useState([
            { value: '', label: '', id: '' },
        ]);
    



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        }
    ,[refreshKey])

    const selectedOption = useMemo(
            () => cmsidOptions.find((option) => option.value === formData.cmsid),
            [formData.cmsid, cmsidOptions]
        );


    useEffect(() => {
            if (selectedOption && selectedOption.id) {
                fetch(`/api/user/${selectedOption.id}`)
                    .then((response) => response.json())
                    .then((data) => {
                        // console.log(data);
                        if (data.data) {
                            setFormData((prevData) => ({
                                ...prevData,
                                cmsid: selectedOption.value,
                                name: data.data.crewname || '',
                                design: data.data.designation || '',
                                hq: data.data.hq || '',
                                icTrainNo: data.data.ic_train_no || '',
                                icTime: data.data.ic_time || prevData.icTime,
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



        const handleSubmit = async (e) => {
            e.preventDefault();
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
                nav.push("/home")
            }
        };



  return (
    <>
        <h1 className="form-name">Check In Form</h1>
            <div className="form-block">
                <form onSubmit={handleSubmit}>
                    <div className="right-block">
                        <div>
                            <label>CMS Id:</label>
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

                        <div>
                            <label>Room No.:</label>
                            <input type='text' name='roomno' value={formData.roomno} onChange={handleChange}/>
                        </div>
                    </div>

                    <div className="left-block">
                        <div>
                            <label>Nature Of Complaint:</label>
                            <input type="text" name="complaintType" value={formData.complaintType} onChange={handleChange} className='special'/>
                        </div>
                        <div>
                            <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} maxLength={200} placeholder="Up to 200 words" className="resizable-textarea"/>
                        </div>
                    </div>

                    <div className="button-div">
                        <button className="submitButton" type="submit">SUBMIT</button>
                    </div>
                </form>
            </div>
        </>
  )
}

export default page