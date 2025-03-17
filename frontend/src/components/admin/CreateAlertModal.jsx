import React, { useState, useEffect } from 'react';

const CreateAlertModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    selectedUserId: '',
    alertText: '',
  });
  const [selectedUserWebhook, setSelectedUserWebhook] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserChange = async (userId) => {
    setFormData(prev => ({ ...prev, selectedUserId: userId }));
    
    // Find the selected user's webhook
    const selectedUser = users.find(user => user._id === userId);
    if (selectedUser && selectedUser.webhookUrl) {
      setSelectedUserWebhook(selectedUser.webhookUrl);
    } else {
      setSelectedUserWebhook('No webhook URL configured');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/send-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: formData.selectedUserId,
          alertText: formData.alertText
        })
      });

      if (response.ok) {
        alert('Alert sent successfully!');
        onClose();
      } else {
        const data = await response.json();
        alert(`Error: ${data.message || 'Failed to send alert'}`);
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      alert('Failed to send alert. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Send Custom Alert
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Select User
              </label>
              <select
                id="user"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.selectedUserId}
                onChange={(e) => handleUserChange(e.target.value)}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            {selectedUserWebhook && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Webhook URL
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm text-gray-600 break-all">
                  {selectedUserWebhook}
                </div>
              </div>
            )}
            <div>
              <label htmlFor="alertText" className="block text-sm font-medium text-gray-700">
                Alert Text
              </label>
              <textarea
                id="alertText"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.alertText}
                onChange={(e) => setFormData({ ...formData, alertText: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Alert
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlertModal;
