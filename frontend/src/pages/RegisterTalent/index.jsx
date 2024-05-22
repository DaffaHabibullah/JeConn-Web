import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import FooterComponent from '../../components/Footer';
import { fetchTalentRegister } from '../../api/Talent';
import { fetchLocations } from '../../api/Locations';
import { fetchPaymentToken } from '../../api/PaymentToken';

const RegisterTalent = () => {
    const [registerTalent, setRegisterTalent] = useState({
        nikKTP: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        provinceId: '',
        postalCode: ''
    });
    const [locations, setLocations] = useState([]);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocationsData = async () => {
            try {
                const response = await fetchLocations();
                setLocations(response.data);
            } catch (error) {
                console.error('Failed to fetch locations:', error);
                throw error;
            }
        };

        fetchLocationsData();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setRegisterTalent(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const paymentTokenResponse = await fetchPaymentToken();
            if (paymentTokenResponse.success) {
                const paymentToken = paymentTokenResponse.data.token;
    
                window.snap.pay(paymentToken, {
                    onSuccess: async function(result) {
                        console.log('Payment success:', result);
    
                        try {
                            await fetchTalentRegister(
                                registerTalent.nikKTP,
                                registerTalent.firstName,
                                registerTalent.lastName,
                                registerTalent.phoneNumber,
                                registerTalent.address,
                                registerTalent.provinceId,
                                registerTalent.postalCode
                            );
    
                            setSuccess('Registration successful');
                            setError(null);
    
                            navigate('/talent-profile');
                        } catch (error) {
                            console.error('Failed to register talent:', error);
                            setError('Failed to register talent');
                            setSuccess(null);
                        }
                    },
                    onPending: function(result) {
                        console.log('Payment pending:', result);
                        setError('Payment is pending. Please complete the payment.');
                        setSuccess(null);
                    },
                    onError: function(result) {
                        console.error('Payment error:', result);
                        setError('Payment failed. Please try again.');
                        setSuccess(null);
                    },
                    onClose: function() {
                        console.log('Payment popup closed');
                        setError('Payment was cancelled.');
                        setSuccess(null);
                    }
                });
            } else {
                setError('Failed to create payment token');
                setSuccess(null);
            }
        } catch (error) {
            console.error('Failed to fetch payment token:', error);
            setError('Failed to fetch payment token');
            setSuccess(null);
        }
    };

    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }}>
                <Row className="d-flex justify-content-center align-items-center" style={{ padding: '16px' }}>
                    <Card>
                        <Row className="d-flex justify-content-center align-items-start" style={{ padding: '32px' }}>
                            <h2 className="d-flex justify-content-center" style={{ marginBottom: '32px' }}>Plan and Price</h2>
                            <Col sm="6">
                                <Card className="mb-3" style={{ paddingTop: '32px', border: '3px solid #6C757D', backgroundColor: '#6C757D' }}>
                                    <Card.Body>
                                        <Badge bg="secondary" style={{ position: 'absolute', top: '5px', right: '8px' }}>Current</Badge>
                                        <Row sm="2" className="d-flex justify-content-center align-items-center">
                                            <Card.Title>Basic user</Card.Title>
                                            <h3 className="d-flex justify-content-end">Free</h3>
                                        </Row>
                                        <Card.Text style={{ marginTop: '32px' }}>
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Post vacancies for Talent </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Easy finding Talent </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Easy connect with Talent </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Easy payment </li>
                                            </ul>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col sm="6" style={{ cursor: 'pointer' }}>
                                <Card className="mb-3" style={{ paddingTop: '32px', borderTop: '3px solid #00A47F', borderLeft: '8px solid #00A47F', borderRight: '5px solid #00A47F', borderBottom: '8px solid #00A47F', backgroundColor: '#00A47F' }}>
                                    <Card.Body>
                                        <Badge bg="success" style={{ position: 'absolute', top: '5px', right: '8px' }}>Selected</Badge>
                                        <Row sm="2" className="d-flex justify-content-center align-items-center">
                                            <Card.Title>Upgrade to Become a Talent ✨</Card.Title>
                                            <h3 className="d-flex justify-content-end">IDR: 10.000</h3>
                                        </Row>
                                        <Card.Text style={{ marginTop: '32px' }}>
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                <li> <i className="bi bi-check-circle-fill"></i> Lifetime access : </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ All access on Basic User </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Open freelance </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Can change work locations </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Upload image for Talent up to 20 photos </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Advanced Security </li>
                                                <li> <i className="bi bi-check-circle-fill"></i> ▸ Priority support </li>
                                            </ul>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <h2 className="text-center" style={{ paddingTop: '64px' }}>Talent Registration</h2>

                        <Row className="d-flex justify-content-center align-items-center" style={{ paddingBottom: '24px' }}>
                            <Col sm="1" style={{ borderTop: '1px solid #00A47F' }}></Col>
                            <Col sm="2" style={{ borderTop: '1px solid #00A47F' }}></Col>
                        </Row>

                        <Card.Body style={{ padding: '16px' }}>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="nikKTP" className="mb-3">
                                    <Form.Label>NIK KTP</Form.Label>
                                    <Form.Control type="number" value={registerTalent.nikKTP} onChange={handleInputChange} required />
                                </Form.Group>

                                <Row>
                                    <Col sm="6">
                                        <Form.Group controlId="firstName" className="mb-3">
                                            <Form.Label>Nama Depan</Form.Label>
                                            <Form.Control type="text" value={registerTalent.firstName} onChange={handleInputChange} required />
                                        </Form.Group>
                                    </Col>

                                    <Col sm="6">
                                        <Form.Group controlId="lastName" className="mb-3">
                                            <Form.Label>Nama Belakang</Form.Label>
                                            <Form.Control type="text" value={registerTalent.lastName} onChange={handleInputChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="phoneNumber" className="mb-3">
                                    <Form.Label>Nomor Telepon</Form.Label>
                                    <Form.Control type="number" value={registerTalent.phoneNumber} onChange={handleInputChange} required />
                                </Form.Group>

                                <Form.Group controlId="address" className="mb-3">
                                    <Form.Label>Alamat</Form.Label>
                                    <Form.Control as="textarea" value={registerTalent.address} onChange={handleInputChange} required />
                                </Form.Group>

                                <Row>
                                    <Col sm="6">
                                        <Form.Group controlId="provinceId" className="mb-3">
                                            <Form.Label>Provinsi</Form.Label>
                                            <Form.Control as="select" value={registerTalent.provinceId} onChange={handleInputChange} required>
                                                <option value="" disabled>Pilih Provinsi</option>
                                                {locations.map(location => (
                                                    <option key={location._id} value={location._id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col sm="6">
                                        <Form.Group controlId="postalCode" className="mb-3">
                                            <Form.Label>Kode Pos</Form.Label>
                                            <Form.Control type="number" value={registerTalent.postalCode} onChange={handleInputChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="success" type="submit" style={{ width: '100%', marginTop: '48px' }}>
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
            <FooterComponent />
        </div>
    );
};


export default RegisterTalent;
