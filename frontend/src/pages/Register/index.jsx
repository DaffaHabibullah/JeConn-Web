import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import { fetchRegister } from '../../api/Auth';
import { useNotification } from '../../components/Notification';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', false);
            return;
        }
        try {
            const response = await fetchRegister(username, email, password);
            showNotification(response.message);
            navigate('/login');
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#00A47F', minHeight: '100vh' }}>
            <Container className="d-flex justify-content-center align-items-center" style={{ padding: '16px', borderRadius: '5px' }}>
                <Row className="w-100" style={{ padding: '8px', paddingTop: '16px', paddingBottom: '16px', borderRadius: '5px' }}>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <Image fluid src='/images/register-image.jpg' alt="Register Image" />
                    </Col>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <div className="w-100">
                            <h1 className="mb-5 text-center">Register to <span style={{ color: '#00A47F' }}>Jeconn</span></h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formGroupUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" value={username} minLength={4} maxLength={16} onChange={(e) => setUsername(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} maxLength={36} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" value={password} minLength={8} maxLength={64} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password again" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </Form.Group>
                                <Form.Text className="text-center d-block mb-3">
                                    Sudah memiliki akun? <a href="/login" className="text-decoration-none"><b>Login</b></a>
                                </Form.Text>
                                <div className="d-grid gap-2" style={{ marginTop: '32px' }}>
                                    <Button type="submit" variant="outline-success" size="lg" style={{ backgroundColor: '#00A47F', color: '#FFFFFF' }}>Register</Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};


export default Register;
