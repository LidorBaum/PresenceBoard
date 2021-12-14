import React from 'react';
import { BoardEmployeePreview } from './BoardEmployeePreview';

export const BoardEmployeeList = ({ employees, onChangePresence }) => {
    return (
        <>
            <div className="employee-list">
                {employees.map(emp => (
                    <BoardEmployeePreview
                        onChangePresence={onChangePresence}
                        key={emp._id}
                        emp={emp}
                    />
                ))}
            </div>
        </>
    );
};
