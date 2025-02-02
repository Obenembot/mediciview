import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import User from './pages/User'

const App = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
        firstName: '',
        surname: '',
        email: '',
        password: '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [isPasswordUpdate, setPasswordUpdate] = useState(false);
    const [message, setMessage] = useState(null);

    const apiBaseUrl = 'http://localhost:8081/api/users';
    axios.defaults.headers.common['X-Username'] = 'Medici Web';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiBaseUrl}/`);
            setUsers(response.data.content);
        } catch (error) {
            setMessage({type: 'error', text: 'Failed to fetch users'});
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleCreateOrUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isPasswordUpdate) {
                await axios.put(`${apiBaseUrl}/${selectedUser.email}/${formData.password}/${formData.newPassword}`, {});
                setMessage({type: 'success', text: 'User password updated successfully!'});
                setPasswordUpdate(false);
            } else if (selectedUser) {
                await axios.put(`${apiBaseUrl}/`, formData);
                setMessage({type: 'success', text: 'User updated successfully!'});
            } else {
                await axios.post(`${apiBaseUrl}/`, formData);
                setMessage({type: 'success', text: 'User created successfully!'});
            }
            fetchUsers();
            setFormData({id: null, firstName: '', surname: '', email: '', password: '', newPassword: ''});
            setSelectedUser(null);
        } catch (error) {
            setMessage({type: 'error', text: error?.response?.data?.error});
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (email) => {
        setLoading(true);
        try {
            await axios.delete(`${apiBaseUrl}/${email}`);
            setMessage({type: 'success', text: 'User deleted successfully!'});
            await fetchUsers();
        } catch (error) {
            setMessage({type: 'error', text: error?.response?.data?.error});
        } finally {
            setLoading(false);
            setFormData({id: null, firstName: '', surname: '', email: '', password: '', newPassword: ''});
            setSelectedUser(null);
            setPasswordUpdate(false);
        }
    };

    const setUserHandle = async (user) => {
        try {
            setLoading(true);
            setPasswordUpdate(false)
            setSelectedUser(user);
            setFormData(user);
            await fetchUsers();
        } catch (error) {
            setMessage({type: 'error', text: error?.response?.data?.error});
        } finally {
            setLoading(false);
        }
    };

    const setUserPasswordHandle = async (user) => {
        try {
            setLoading(true);
            setPasswordUpdate(true)
            delete user.password;
            setSelectedUser(user);
            setFormData(user);
            await fetchUsers();
        } catch (error) {
            setMessage({type: 'error', text: error?.response?.data?.error});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <Router>
                <nav>
                    <ul>
                        <li><Link to="/user">User for testing Nav/Links</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/user" element={<User />} />
                </Routes>
            </Router>
            <h1>Medici User Management System</h1>
            {message && <p className={message.type}>{message.text}</p>}
            <form onSubmit={handleCreateOrUpdateUser}>

                {!isPasswordUpdate && (
                    <input
                        type="text"
                        name="firstName"
                        placeholder="first Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />)}
                {!isPasswordUpdate && (
                    <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                {(!selectedUser || isPasswordUpdate) && (
                    <input
                        type="password"
                        name="password"
                        placeholder={isPasswordUpdate ? 'Old Password' : 'Password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                )}
                {isPasswordUpdate && (
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                    />
                )}
                <button className={isPasswordUpdate ? 'update-pass' : 'create'} type="submit" disabled={loading}>
                    {selectedUser ? isPasswordUpdate ? 'Update Password' : 'Update User' : 'Create User'}
                </button>
            </form>
            <table>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Created By</th>
                    <th>Created Date</th>
                    <th>Last Modified By</th>
                    <th>Last Modified Date</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.firstName}</td>
                        <td>{user.surname}</td>
                        <td>{user.email}</td>
                        <td>{user.createdBy}</td>
                        <td>{user.createdDate}</td>
                        <td>{user.lastUpdatedBy}</td>
                        <td>{user.lastUpdatedDate}</td>
                        <td>
                            <button class="update" onClick={() => setUserHandle(user)}>Update</button>

                            <button class="update-pass" onClick={() => setUserPasswordHandle(user)}>Update Password
                            </button>

                            <button class="delete" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
