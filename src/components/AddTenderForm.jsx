// components/AddTenderForm.jsx
import { useState } from 'react';
import axios from 'axios';

const AddTenderForm = () => {
  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    type: '',
    deadline: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);

    try {
      await axios.post('/api/tenders', formData);
      alert('Tender added successfully!');
    } catch (error) {
      console.error(error);
      alert('Error adding tender');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto bg-white rounded shadow space-y-4">
      <input name="title" onChange={handleChange} placeholder="Tender Title" className="w-full p-2 border rounded" />
      <input name="department" onChange={handleChange} placeholder="Department" className="w-full p-2 border rounded" />
      <textarea name="description" onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
      <input name="type" onChange={handleChange} placeholder="Tender Type" className="w-full p-2 border rounded" />
      <input type="date" name="deadline" onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="file" onChange={handleFileChange} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Tender</button>
    </form>
  );
};

export default AddTenderForm;
