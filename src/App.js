import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const apiBaseUrl = 'http://localhost:8081/api/users/'; // Replace with your API URL

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiBaseUrl);
      console.log('content', response)
      setUsers(response.data.content);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedUser) {
        await axios.put(`${apiBaseUrl}/${selectedUser.id}`, formData);
        setMessage({ type: 'success', text: 'User updated successfully!' });
      } else {
        await axios.post(apiBaseUrl, formData);
        setMessage({ type: 'success', text: 'User created successfully!' });
      }
      fetchUsers();
      setFormData({ username: '', email: '', password: '' });
      setSelectedUser(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save user' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseUrl}/${userId}`);
      setMessage({ type: 'success', text: 'User deleted successfully!' });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="App">
        <h1>User Management</h1>
        {message && <p className={message.type}>{message.text}</p>}
        <form onSubmit={handleCreateOrUpdateUser}>
          <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.surname}
              onChange={handleInputChange}
              required
          />
          <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
          />
          <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
          />
          <button type="submit" disabled={loading}>
            {selectedUser ? 'Update User' : 'Create User'}
          </button>
        </form>
        <table>
          <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => setSelectedUser(user)}>Update</button>
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default App;
