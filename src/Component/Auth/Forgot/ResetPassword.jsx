import React, { useCallback, useState } from 'react';
import './register.css';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { API_URL } from '../../../service/api';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const ResetPasswords = () => {
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const mobile = useSelector(state=>state.forgotPasswordData?.mobile)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
const navigate = useNavigate()
  const resetPassword = useCallback(async()=>{
    try {
        const response = await fetch(`${API_URL}/mobileApi/reset-password/${mobile}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(form)
        })
        if(response.status===200){
          const datas = response.json()
          alert(datas.message)
        }
    } catch (error) {
        
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Clear the error and proceed with password reset logic
    setError('');
    // Handle the password reset (e.g., API call)
    resetPassword()
    navigate('/login')
    console.log('Password reset successful:', newPassword);
  };


  return (
    <Container className="reset-password-container d-flex justify-content-center align-items-center">
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <div className="card p-4 shadow rounded">
            <h2 className="text-center mb-4">Reset Password</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                autoComplete=''
                  type="password"
                  placeholder="Enter new password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  autoComplete=''
                  placeholder="Confirm new password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {error && <div className="error-message text-danger text-center">{error}</div>}
              <Button variant="warning" type="submit" className="btn-block mt-3">
                Reset Password
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswords;
