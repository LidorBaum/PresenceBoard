import React from 'react'
import ReactTooltip from 'react-tooltip'
export function EmployeePreview({ emp, editEmployee, deleteEmployee, showNFC }) {
    const onEditEmployee = () => {
        editEmployee(emp)
    }
    const onDeleteEmployee = () => {
        deleteEmployee(emp._id)
    }
    const onShowNFC = () =>{
        showNFC(emp)
    }
    return (
        <tr>
            <td>{emp.firstName}</td>
            <td>{emp.lastName}</td>
            <td className='image-cell'><img src={emp.image} alt="profile" className="employee-card-img" /> </td>
            <td>
                <button data-tip data-for={'edit'} onClick={onEditEmployee} ><img alt='edit' src={'https://res.cloudinary.com/echoshare/image/upload/v1636982096/Edit_icon__the_Noun_Project_30184_.svg_lvvq3f.png'}></img></button>
                <ReactTooltip id='edit' effect='solid' textColor='#626262' backgroundColor='#37f5acc0'>
                    <span>Edit</span>
                </ReactTooltip>
                <button data-tip data-for={'delete'} onClick={onDeleteEmployee}><img alt='delete' src={'https://res.cloudinary.com/echoshare/image/upload/v1636983047/cross-in-circle-in-red-tom-hill-transparent_qohafi.png'}></img></button>
                <ReactTooltip id='delete' effect='solid' textColor='#626262' backgroundColor='#ff82a1'>
                    <span>Delete</span>
                </ReactTooltip>
                <button data-tip data-for={'nfc'} onClick={onShowNFC}><img alt='delete' src={'https://res.cloudinary.com/echoshare/image/upload/v1637527878/nfc_dl53za.png'}></img></button>
                <ReactTooltip id='nfc' effect='solid' textColor='#626262' backgroundColor='#99ddf8'>
                    <span>NFC</span>
                </ReactTooltip>
            </td>

        </tr>
    )
}