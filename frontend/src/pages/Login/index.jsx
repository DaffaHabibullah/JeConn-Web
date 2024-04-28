import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Form, Button, Alert } from 'react-bootstrap';
import { fetchLogin } from '../../services/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchLogin(email, password);
            console.log('Login response:', response);
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#00A47F', minHeight: '100vh' }}>
            <Container className="d-flex justify-content-center align-items-center" style={{ borderRadius: '5px', backgroundColor: '#FFFFFF' }}>
                <Row className="w-100" style={{ padding: '3px', paddingTop: '20px', paddingBottom: '20px', borderRadius: '5px' }}>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <Image fluid src='/images/login-image.png' alt="Login Image" />
                    </Col>
                    <Col md={6} className="d-flex justify-content-center align-items-center" style={{ padding: '50px', borderLeft: '1px solid #00A47F' }}>
                        <div className="w-100">
                            <h1 className="mb-5 text-center">Login to <span style={{ color: '#00A47F' }}>Jeconn</span></h1>
                            {error && (
                                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                    {error}
                                </Alert>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formGroupEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                                <Form.Text className="text-center d-block mb-3">
                                    Belum punya akun? <a href="/register" className="text-decoration-none"><b>Register</b></a>
                                </Form.Text>
                                <div className="d-grid gap-2" style={{ marginTop: '45px' }}>
                                    <Button type="submit" variant="outline-success" size="lg" style={{ backgroundColor: '#00A47F', color: '#FFFFFF' }}>Login</Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default Login;
