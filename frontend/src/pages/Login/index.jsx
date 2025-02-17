import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import { fetchLogin } from '../../api/Auth';
import { checkAuth } from '../../middleware/checkAuth';
import { useNotification } from '../../components/Notification';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const role = checkAuth(token);

            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'user') {
                navigate('/home');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchLogin(email, password);
            const token = response.data.token;
            localStorage.setItem('token', token);

            const role = checkAuth(token);

            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'user') {
                navigate('/home');
            }

            showNotification(response.message);
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#00A47F', minHeight: '100vh' }}>
            <Container className="d-flex justify-content-center align-items-center" style={{ padding: '16px', borderRadius: '5px' }}>
                <Row className="w-100" style={{ padding: '8px', paddingTop: '16px', paddingBottom: '16px', borderRadius: '5px' }}>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <Image fluid src='/images/login-image.jpg' alt="Login Image" />
                    </Col>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <div className="w-100">
                            <h1 className="mb-5 text-center">Login to <span style={{ color: '#00A47F' }}>Jeconn</span></h1>
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
                                <div className="d-grid gap-2" style={{ marginTop: '32px' }}>
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
