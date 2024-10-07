import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form } from 'antd';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch user data');
        setLoading(false);
        console.error('Error fetching users:', error);
      });
  }, []);

  const showModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      street: user.address.street,
      suite: user.address.suite,
      city: user.address.city,
      zipcode: user.address.zipcode,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedUser = { ...selectedUser, ...values, address: {
        street: values.street,
        suite: values.suite,
        city: values.city,
        zipcode: values.zipcode,
      } };
      // Perform the PUT request to update the user
      fetch(`https://jsonplaceholder.typicode.com/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Update the users state with the updated user
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === data.id ? data : user
            )
          );
          setIsModalOpen(false); // Close the modal
        })
        .catch((error) => {
          console.error('Failed to update user:', error);
          alert('Failed to update user: ' + error.message); // Alert user of error
        });
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (userId) => {
    // Perform the DELETE request to remove the user
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Remove the deleted user from the state
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user: ' + error.message); // Alert user of error
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Company Name</th>
            <th>Website</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.phone}</td>
              <td>{`${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`}</td>
              <td>{user.company.name}</td>
              <td>{user.website}</td>
              <td>
                <Button onClick={() => showModal(user)}>Edit</Button>
              </td>
              <td>
                <Button onClick={() => handleDelete(user.id)} danger>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Street"
            name="street"
            rules={[{ required: true, message: 'Please input the street!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Suite"
            name="suite"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input the city!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Zipcode"
            name="zipcode"
            rules={[{ required: true, message: 'Please input the zipcode!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetails;
