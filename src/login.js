import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import './App.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: ''
    },
    companyName: '',
    website: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Autofill username based on name
    if (formData.name) {
      const username = `USER-${formData.name}`;
      setFormData(prevData => ({ ...prevData, username }));
    }
  }, [formData.name]);

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Name: Required, minimum 3 characters
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Email: Required, valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Phone: Required, valid phone format
    const phoneRegex = /^\d{10}$/; // Assuming 10 digit phone numbers
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits long';
    }

    // Address fields: Required
    if (!formData.address.street) {
      newErrors.street = 'Street is required';
    }
    if (!formData.address.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.address.zipcode) {
      newErrors.zipcode = 'Zipcode is required';
    }

    // Company Name: Optional, but if provided must be at least 3 characters
    if (formData.companyName && formData.companyName.length < 3) {
      newErrors.companyName = 'Company name must be at least 3 characters long';
    }

    // Website: Optional, must be a valid URL if provided
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (formData.website && !urlRegex.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Send the data to JSONPlaceholder API
      const newId = uuidv4();
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: newId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          address: {
            street: formData.address.street,
            suite: formData.address.suite,
            city: formData.address.city,
            zipcode: formData.address.zipcode
          },
          companyName: formData.companyName,
          website: formData.website
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          navigate('/users');
          console.log('Form data submitted:', data);
          // Optionally reset form data after successful submission
          setFormData({
            name: '',
            email: '',
            phone: '',
            username: '',
            address: {
              street: '',
              suite: '',
              city: '',
              zipcode: ''
            },
            companyName: '',
            website: ''
          });
          setErrors({}); // Clear errors if needed
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}
      </div>

      {/* Username (auto-filled and non-editable) */}
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          readOnly
        />
      </div>

      {/* Address Fields */}
      <div>
        <label>Street:</label>
        <input
          type="text"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
        />
        {errors.street && <p className="error">{errors.street}</p>}
      </div>

      <div>
        <label>Suite:</label>
        <input
          type="text"
          name="address.suite"
          value={formData.address.suite}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>City:</label>
        <input
          type="text"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
        />
        {errors.city && <p className="error">{errors.city}</p>}
      </div>

      <div>
        <label>Zipcode:</label>
        <input
          type="text"
          name="address.zipcode"
          value={formData.address.zipcode}
          onChange={handleChange}
        />
        {errors.zipcode && <p className="error">{errors.zipcode}</p>}
      </div>

      {/* Company Name (Optional) */}
      <div>
        <label>Company Name:</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
        {errors.companyName && <p className="error">{errors.companyName}</p>}
      </div>

      {/* Website (Optional) */}
      <div>
        <label>Website:</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
        {errors.website && <p className="error">{errors.website}</p>}
      </div>

      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Login;
