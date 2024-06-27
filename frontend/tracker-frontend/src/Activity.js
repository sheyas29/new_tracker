import React, { useState } from 'react';

const Activity = ({ activity, onCheck, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableActivity, setEditableActivity] = useState({ ...activity });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableActivity(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        onUpdate(editableActivity);
        setIsEditing(false);
    };

    return (
        <tr className={activity.isChecked ? 'checked-row' : ''}>
            {isEditing ? (
                <>
                    <td><input type="text" name="hrs" value={editableActivity.hrs} onChange={handleInputChange} /></td>
                    <td><input type="text" name="mins" value={editableActivity.mins} onChange={handleInputChange} /></td>
                    <td><input type="text" name="sec" value={editableActivity.sec} onChange={handleInputChange} /></td>
                    <td>{editableActivity['si.no']}</td>
                    <td><input type="text" name="activity_name" value={editableActivity.activity_name} onChange={handleInputChange} /></td>
                    <td><input type="text" name="confirmed_by" value={editableActivity.confirmed_by} onChange={handleInputChange} /></td>
                    <td>
                        <button onClick={handleSave}>Save</button>
                    </td>
                </>
            ) : (
                <>
                    <td>{activity.hrs}</td>
                    <td>{activity.mins}</td>
                    <td>{activity.sec}</td>
                    <td>{activity['si.no']}</td>
                    <td>{activity.activity_name}</td>
                    <td>{activity.confirmed_by}</td>
                    <td>
                        {activity.confirmed_by ? (
                            <input
                                type="checkbox"
                                onChange={(e) => onCheck(activity['si.no'], e.target.checked)}
                                checked={activity.isChecked}
                            />
                        ) : null}
                    </td>
                </>
            )}
        </tr>
    );
};

export default Activity;
