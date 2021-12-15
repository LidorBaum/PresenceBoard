import React, { useState } from 'react';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import ReactTooltip from 'react-tooltip';

export function BoardEmployeePreview({ emp, onChangePresence }) {
    const [isLoading, setIsLoading] = useState(false);
    const onChangePresenceClick = async employeeId => {
        setIsLoading(true);
        await onChangePresence(employeeId);
        return setIsLoading(false);
    };
    return (
        <article
            id={`${emp._id}-card`}
            className="employee-card"
            onClick={() => onChangePresenceClick(emp._id)}
        >
            <div className="click-loader">
                {isLoading && <Hypnosis width="100px" height="100px" />}
            </div>
            <p data-tip data-for={emp._id}>
                {emp.firstName + ' ' + emp.lastName}
            </p>
            <ReactTooltip id={emp._id}>
                <span>
                    {emp.firstName + ' ' + emp.lastName}
                    <br />
                    Last scanned:{' '}
                    {emp.lastScan
                        ? new Intl.DateTimeFormat('en-il', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: 'numeric',
                              minute: 'numeric',
                          }).format(new Date(emp.lastScan))
                        : 'Never Scanned'}
                </span>
            </ReactTooltip>
            <img
                id={`${emp._id}-img`}
                src={emp.image}
                alt="profile"
                className={[
                    emp.isPresence ? 'color' : 'gray',
                    'employee-card-img',
                ].join(' ')}
            />
        </article>
    );
}
