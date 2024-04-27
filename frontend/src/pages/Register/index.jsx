import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import registerImage from '../../assets/register-image.png';

const Register = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Image src={registerImage} width={400} height={400} alt="Logo" />
                </Col>
                <Col>
                    <h1 className="mb-5" style={{ textAlign: 'center' }}>Register to <span style={{ color: '#00A47F' }}>Jeconn</span></h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formGroupUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password again" />
                        </Form.Group>
                        <Form.Text style={{ textAlign: 'center' }} as="p" className="mb-0" muted>
                            Already have an account? <a style={{ textDecoration: 'none' }} href="/login"><b>Login</b></a>
                        </Form.Text>
                        <div className="d-grid gap-2" style={{ marginTop: '20px' }}>
                            <Button type="submit" variant="outline-success" size="lg" style={{ backgroundColor: '#00A47F', color: '#FFFFFF' }}>Register</Button>{' '}
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};


export default Register;
