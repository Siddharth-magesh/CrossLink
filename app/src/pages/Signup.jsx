import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const Signup = () => {
  const [form, setForm] = useState({
    registration_number: '',
    name: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${url_base}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Signup successful! Please login.');
        navigate('/user-login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Server not reachable');
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-dark text-white">
      <form onSubmit={handleSignup} className="w-75">
        <h2 className="mb-4 text-center">Signup</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Registration Number</label>
          <input
            type="text"
            className="form-control"
            name="registration_number"
            value={form.registration_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger w-100">Signup</button>
        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <span
            className="text-danger"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/user-login')}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
