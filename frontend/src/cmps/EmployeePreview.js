import {Link} from 'react-router-dom'
import React from 'react'
export function EmployeePreview({emp}) {
    return (
        // <article className="employee-card">
        <tr>
            <td>{emp.firstName}</td>
            <td>{emp.lastName}</td>
            <td className='image-cell'><img src={emp.image} alt="profile" className="employee-card-img"  /> </td>
            <td>
                <button><img src={'https://res.cloudinary.com/echoshare/image/upload/v1636982096/Edit_icon__the_Noun_Project_30184_.svg_lvvq3f.png'}></img></button>
                <button><img src={'https://res.cloudinary.com/echoshare/image/upload/v1636983047/cross-in-circle-in-red-tom-hill-transparent_qohafi.png'}></img></button>
                </td>
        {/* <p className="product-card-name">{emp.firstName}</p>
        <p className="product-card-name">{emp.lastName}</p>
        <img src={emp.image} alt="profile" className="employee-card-img"  /> */}
        </tr>
    // </article>
    )
}