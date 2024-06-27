import React, { useEffect, useState } from 'react';
import Activity from './Activity';
import axios from 'axios';
import './styles.css';

const Tracker = () => {
    const [activities, setActivities] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableActivity, setEditableActivity] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const activitiesPerPage = 10;

    useEffect(() => {
        axios.get('http://localhost:3001/api/activities')
            .then(response => {
                const initialActivities = response.data.map(activity => ({
                    ...activity,
                    isChecked: false
                }));
                setActivities(initialActivities);
            })
            .catch(error => console.error('Error fetching activities:', error));
    }, []);

    const handleCheck = (si_no, isChecked) => {
        setActivities(prevState =>
            prevState.map(activity =>
                activity['si.no'] === si_no ? { ...activity, isChecked } : activity
            )
        );
    };

    const handleUpdate = (updatedActivity) => {
        setActivities(prevState =>
            prevState.map(activity =>
                activity['si.no'] === updatedActivity['si.no'] ? updatedActivity : activity
            )
        );
        setIsEditing(false);
        setEditableActivity(null);
    };

    const calculateProgress = () => {
        const total = activities.filter(activity => activity.confirmed_by).length;
        const checkedCount = activities.filter(activity => activity.isChecked && activity.confirmed_by).length;
        return total > 0 ? (checkedCount / total) * 100 : 0;
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleEditClick = () => {
        const si_no = prompt('Enter the Si.no of the activity you want to edit:');
        if (si_no) {
            const activity = activities.find(act => act['si.no'] === si_no);
            if (activity) {
                setEditableActivity({ ...activity });
                setIsEditing(true);
            } else {
                alert('Activity not found!');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableActivity(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        handleUpdate(editableActivity);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all checks? This action cannot be undone.")) {
            if (window.confirm("This is your final confirmation. Do you really want to reset all checks?")) {
                setActivities(prevState =>
                    prevState.map(activity => ({
                        ...activity,
                        isChecked: false
                    }))
                );
            }
        }
    };

    const sortedActivities = React.useMemo(() => {
        let sortableActivities = [...activities];
        if (sortConfig !== null) {
            sortableActivities.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableActivities;
    }, [activities, sortConfig]);

    const filteredActivities = sortedActivities.filter(activity => {
        if (filter === 'all') return true;
        if (filter === 'checked' && activity.isChecked) return true;
        if (filter === 'unchecked' && !activity.isChecked && activity.confirmed_by) return true;
        return false;
    });

    // Pagination logic
    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity);
    const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalActivities = activities.filter(activity => activity.confirmed_by).length;
    const completedActivities = activities.filter(activity => activity.isChecked && activity.confirmed_by).length;
    const leftOutActivities = activities.filter(activity => activity.confirmed_by && !activity.isChecked).length;

    return (
        <div className="tracker-container">
            <div className="main-content">
                <h1>Activity Tracker</h1>
                <div className="info-boxes">
                    <div className="info-box">
                        <h3>Total Activities</h3>
                        <p>{totalActivities}</p>
                    </div>
                    <div className="info-box">
                        <h3>Completed Activities</h3>
                        <p>{completedActivities}</p>
                    </div>
                    <div className="info-box">
                        <h3>Left Out Activities</h3>
                        <p>{leftOutActivities}</p>
                    </div>
                </div>
                {isEditing && editableActivity && (
                    <div className="edit-form">
                        <h3>Edit Activity</h3>
                        <label>
                            Hrs:
                            <input
                                type="text"
                                name="hrs"
                                value={editableActivity.hrs}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Mins:
                            <input
                                type="text"
                                name="mins"
                                value={editableActivity.mins}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Sec:
                            <input
                                type="text"
                                name="sec"
                                value={editableActivity.sec}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Activity Name:
                            <input
                                type="text"
                                name="activity_name"
                                value={editableActivity.activity_name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Confirmed By:
                            <input
                                type="text"
                                name="confirmed_by"
                                value={editableActivity.confirmed_by}
                                onChange={handleInputChange}
                            />
                        </label>
                        <button onClick={handleSave}>Save</button>
                    </div>
                )}
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th className="fit-content" onClick={() => handleSort('hrs')}>Hrs</th>
                            <th className="fit-content" onClick={() => handleSort('mins')}>Mins</th>
                            <th className="fit-content" onClick={() => handleSort('sec')}>Sec</th>
                            <th className="fit-content" onClick={() => handleSort('si.no')}>Si.no</th>
                            <th onClick={() => handleSort('activity_name')}>Activity Name</th>
                            <th onClick={() => handleSort('confirmed_by')}>Confirmed By</th>
                            <th className="fit-content">Check</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentActivities.map(activity => (
                            <Activity key={activity['si.no']} activity={activity} onCheck={handleCheck} onUpdate={handleUpdate} />
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
            <div className="progress-container">
                <h3>Progress</h3>
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ height: `${calculateProgress()}%` }}>
                        <span className="progress-bar-text">{calculateProgress().toFixed(2)}%</span>
                    </div>
                </div>
            </div>
            <div className="controls">
                <label>Filter: </label>
                <select value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="checked">Checked</option>
                    <option value="unchecked">Unchecked</option>
                </select>
                <button onClick={handleEditClick}>Edit Activity</button>
            </div>
            <button className="reset-button" onClick={handleReset}>Reset All Checks</button>
        </div>
    );
};

export default Tracker;
