import React, { useState } from 'react';
import axios from 'axios';

const ResistrationForm = () => {
    
  const [formData, setFormData] = useState({
    refNo: '',
    name: '',
    email: '',
    contact: '',
    college: '',
    department: '',
    type: 'solo',
    paymentScreenshotURL: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {

    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/queue-submitted', formData);
      console.log(res.data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '2rem' }}>
      <h2>Submit Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="refNo" placeholder="Ref No" value={formData.refNo} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
        <input type="text" name="college" placeholder="College" value={formData.college} onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="solo">Solo</option>
          <option value="duo">Duo</option>
          <option value="tro">Tro</option>
        </select>

        <input
          type="text"
          name="paymentScreenshotURL"
          placeholder="Payment Screenshot URL"
          value={formData.paymentScreenshotURL}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>

      {submitted && <p style={{ color: 'green' }}>Form submitted successfully!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResistrationForm;
