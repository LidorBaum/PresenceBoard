import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";

export function BoardEmployeePreview({ emp, onChangePresence }) {
    const [isLoading, setIsLoading] = useState(false)
    // if (!emp.isPresence) return <></>

    const onChangePresenceClick = async (employeeId) => {
        // document.getElementById(`${employeeId}`).classList.toggle('gray')
        console.log("HERE?");
        setIsLoading(true)
        await onChangePresence(employeeId)
        setIsLoading(false)
    }
    return (
        <article id={`${emp._id}-card`} className="employee-card" onClick={() => onChangePresenceClick(emp._id)}>
            <div className='click-loader'>{isLoading && <Hypnosis width="100px" height="100px" />}</div>
            <p>{emp.firstName + " " + emp.lastName}</p>
            <img id={emp._id} src={emp.image} alt="profile" className={[emp.isPresence ? "color" : "gray", "employee-card-img"].join(" ")} />
        </article>
    )
}