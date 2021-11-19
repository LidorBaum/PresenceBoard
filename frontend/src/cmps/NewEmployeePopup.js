
import React, { useState } from 'react';
import { uploadImg } from '../services/cloudinaryService';
import employeeService from '../services/employeeService';
 
export const NewEmployeePopup = props => {
    const [empForm, setForm] = useState({
        firstName: '',
        lastName: '',

        
    })
    const [isUploading, setIsUploading] = useState(false)

    const handleChange = e => {
        e.persist();
        const target = e.target.name
        const value = e.target.value
        setForm(prevForm => {
            return { ...prevForm, [target]: value }
        })
    }
    const [primaryImgUrl, setPrimaryUrl] = useState('https://res.cloudinary.com/echoshare/image/upload/v1634132726/productImgs/799-7998561_add-photo-placeholder-north-luwu-regency_qb0eii.jpg')
    const onUploadImg = async e => {
        e.persist()
        setIsUploading(true)
        const url = await uploadImg(e)
        setPrimaryUrl(url)
        setIsUploading(false)
    }
    const onAddEmployee = async (e) =>{
        e.preventDefault()
        if(primaryImgUrl === 'https://res.cloudinary.com/echoshare/image/upload/v1634132726/productImgs/799-7998561_add-photo-placeholder-north-luwu-regency_qb0eii.jpg'){
            console.log("You must upload a photo");
            return
        }
        const employee = {
            firstName: empForm.firstName,
            lastName: empForm.lastName,
            image: primaryImgUrl,
            company: props.companyId
        }
        console.log(("Empl to add:", employee));
        await employeeService.addEmployee(employee)
        props.handleClose()
    }
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
            <form onSubmit={onAddEmployee}>
            <input minLength="5" required type='text' name='firstName' value={empForm.firstName} placeholder="Employee First Name" onChange={handleChange} /> 
            <input minLength="5" required type='text' name='lastName' value={empForm.lastName} placeholder="Employee Last Name" onChange={handleChange} /> 
            <label>
                    <div className={'img-upload'}>
                        <img alt='profile img' className='primary-img' src={primaryImgUrl} />
                    </div>
                    <input hidden onChange={onUploadImg} type="file" />
                </label>
            <input type='text' disabled={isUploading} name='company-name' value={props.company} />
            <button>Add</button>
            </form>
      </div>
    </div>
  );
};
 
