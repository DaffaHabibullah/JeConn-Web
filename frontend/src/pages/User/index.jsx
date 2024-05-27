import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, OverlayTrigger, Tooltip, InputGroup, Form, Badge, Button } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import { fetchUserProfile, fetchUserUpdate, fetchUserUpdateImage } from '../../api/User';
import { fetchPostVacanciesById } from '../../api/Vacancies';

const User = () => {
    const [userProfile, setUserProfile] = useState({
        imageProfile: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phoneNumber: '',
        roles: [],
        vacanciesId: [],
    });
    const [vacancies, setVacancies] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserAndVacancies = async () => {
            try {
                const userResponse = await fetchUserProfile();
                setUserProfile(userResponse.data);

                const vacanciesPromises = userResponse.data.vacanciesId.map(id => fetchPostVacanciesById(id));
                const vacanciesResults = await Promise.all(vacanciesPromises);
                const sortedVacancies = vacanciesResults.map(result => result.data).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setVacancies(sortedVacancies);
            } catch (error) {
                console.error('Failed to fetch user profile and vacancies:', error);
                throw error;
            }
        };

        if (token) {
            fetchUserAndVacancies();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserProfile(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleConfirmClick = async () => {
        try {
            await fetchUserUpdate(
                userProfile.fullName,
                userProfile.dateOfBirth,
                userProfile.gender,
                userProfile.address,
                userProfile.phoneNumber
            );
            setIsEditMode(false);
        } catch (error) {
            console.error('Failed to update user profile:', error);
        }
    };

    const handleHoverImage = (props) => (
        <Tooltip {...props}>
            Change Profile Image
        </Tooltip>
    );

    const handleImageChange = async (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            try {
                await fetchUserUpdateImage(selectedImage);
                setUserProfile(prevState => ({
                    ...prevState,
                    imageProfile: URL.createObjectURL(selectedImage)
                }));
            } catch (error) {
                console.error('Failed to update profile image:', error);
            }
        }
    };

    const handleImageClick = () => {
        document.getElementById('imageInput').click();
    };

    const genderOptions = [
        { label: "Laki-laki", value: "Laki-laki" },
        { label: "Perempuan", value: "Perempuan" },
    ];

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const createdAt = new Date(timestamp);
        const diffInSeconds = Math.floor((now - createdAt) / 1000);
        let diffInMinutes = Math.floor(diffInSeconds / 60);
        let diffInHours = Math.floor(diffInMinutes / 60);
        let diffInDays = Math.floor(diffInHours / 24);
    
        if (diffInDays > 0) {
            return `${diffInDays} days ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hours ago`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} minutes ago`;
        } else {
            return `Just now`;
        }
    };

    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }}>
                <Row className="d-flex justify-content-center align-items-center">
                    <Card className="d-flex flex-column" style={{ padding: '16px' }}>
                        <h2 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>Dashboard Profile and Post</h2>
                        <Row>
                            <Col xs={12} md={6} className="pt-3 d-flex flex-column align-items-center" style={{ borderBottom: '1px solid #00A47F' }}>
                                <OverlayTrigger placement="bottom" delay={{ show: 240, hide: 60 }} overlay={handleHoverImage}>
                                    <Card.Img
                                        variant="top"
                                        style={{ width: '192px', height: '192px', padding: '8px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover', border: '1px solid #00A47F' }}
                                        src={userProfile.imageProfile}
                                        alt="Profile Image"
                                        onClick={handleImageClick}
                                    />
                                </OverlayTrigger>
                                <input id="imageInput" type="file" accept=".jpg, .jpeg, .png" style={{ display: 'none' }} onChange={handleImageChange} />
                                <Card.Body className="d-flex flex-column align-items-center">
                                    <Card.Title><b>{userProfile.username}</b></Card.Title>
                                    <Card.Text>
                                        <Row>
                                            <InputGroup className="mt-3">
                                                <InputGroup.Text id="full-name" style={{ width: '160px', backgroundColor: '#00A47F', color: '#FFFFFF' }}>Nama Lengkap</InputGroup.Text>
                                                <Form.Control id="fullName" type="text" aria-describedby="full-name" value={userProfile.fullName} onChange={handleInputChange} disabled={!isEditMode} />
                                            </InputGroup>

                                            <InputGroup className="mt-3">
                                                <InputGroup.Text id="date-of-birth" style={{ width: '160px', backgroundColor: '#00A47F', color: '#FFFFFF' }}>Tanggal Lahir</InputGroup.Text>
                                                <Form.Control id="dateOfBirth" type="date" aria-describedby="date-of-birth" value={userProfile.dateOfBirth} onChange={handleInputChange} disabled={!isEditMode} />
                                            </InputGroup>

                                            <InputGroup className="mt-3">
                                                <InputGroup.Text id="gender" style={{ width: '160px', backgroundColor: '#00A47F', color: '#FFFFFF' }}>Jenis Kelamin</InputGroup.Text>
                                                <Form.Select id="gender" aria-describedby="gender" value={userProfile.gender} onChange={handleInputChange} disabled={!isEditMode}>
                                                    <option value="" disabled>Pilih jenis kelamin</option>
                                                    {genderOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </Form.Select>
                                            </InputGroup>

                                            <InputGroup className="mt-3">
                                                <InputGroup.Text id="address" style={{ width: '160px', backgroundColor: '#00A47F', color: '#FFFFFF', alignItems: 'start' }}>Alamat</InputGroup.Text>
                                                <Form.Control id="address" style={{ minHeight: '80px' }} as="textarea" aria-describedby="address" value={userProfile.address} onChange={handleInputChange} disabled={!isEditMode} />
                                            </InputGroup>

                                            <InputGroup className="mt-3">
                                                <InputGroup.Text id="phone-number" style={{ width: '160px', backgroundColor: '#00A47F', color: '#FFFFFF' }}>Nomor Telepon</InputGroup.Text>
                                                <Form.Control id="phoneNumber" type="number" aria-describedby="phone-number" value={userProfile.phoneNumber} onChange={handleInputChange} disabled={!isEditMode} />
                                            </InputGroup>

                                            <InputGroup className="mt-3 d-flex justify-content-center align-items-center">
                                                <InputGroup.Text id="roles">Roles</InputGroup.Text>
                                                {userProfile.roles.map((roles, index) => (
                                                    <Badge key={index} bg={roles === "talent" ? "warning" : "success"} className="me-1">
                                                        {roles}
                                                    </Badge>
                                                ))}
                                            </InputGroup>
                                        </Row>
                                    </Card.Text>
                                    {isEditMode ? (
                                        <Row style={{ marginTop: '32px', marginBottom: '48px' }}>
                                            <Col className='d-flex justify-content-center'>
                                                <Button variant="secondary" onClick={() => setIsEditMode(false)}>Cancel</Button>
                                                <Button variant="success" className="ms-2" onClick={handleConfirmClick}>Confirm</Button>
                                            </Col>
                                        </Row>
                                    ) : (
                                        <Row style={{ marginTop: '32px', marginBottom: '48px' }}>
                                            <Col className='d-flex justify-content-center'>
                                                <Button variant="success" onClick={() => setIsEditMode(true)}>Edit Profile</Button>
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Col>

                            <Col className="pt-4" style={{ paddingBottom: '48px', borderBottom: '1px solid #00A47F' }}>
                                <Col xs={12} className="mb-4 d-flex justify-content-between align-items-center">
                                    <h3>Your Vacancies Post</h3>
                                    <Button variant="success">New Post</Button>
                                </Col>
                                
                                {vacancies.map((vacancy, index) => (
                                    <Card key={index} style={{ width: '90%', margin: 'auto', marginBottom: '32px' }}>
                                        <Card.Body>
                                            <Row className="mb-4">
                                                <Col xs={8} md={8} xl={10} style={{ maxHeight: '7rem' }}>
                                                    <Card.Title><a href={`/vacancies/post/${vacancy._id}`} style={{ textDecoration: 'none', color: '#000000' }}>{vacancy.title}</a></Card.Title>
                                                    <Card.Text>{vacancy.location}</Card.Text>
                                                </Col>
                                            </Row>
                                            <span className="text-center" style={{ position: 'absolute', right: '8px', top: '16px' }}>
                                                <Badge bg={
                                                    vacancy.status ? 
                                                    (vacancy.typePost === "Event" ? "warning" : "success") :
                                                    "secondary"
                                                    }>
                                                    {vacancy.typePost}
                                                </Badge>
                                            </span>
                                            <span className="text-center" style={{ position: 'absolute', right: '8px', top: '48px' }}>{vacancy.candidates} Candidates</span>
                                            <Card.Text style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                {vacancy.description}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer style={{ backgroundColor: '#FFFFFF'}}>
                                            <Col className="d-flex justify-content-between">
                                                <small className="text-muted">{getTimeAgo(vacancy.createdAt).toLocaleString()}</small>
                                                <small className="text-muted"><a href={`/vacancies/post/${vacancy._id}`} style={{ textDecoration: 'none', color: '#00A47F' }}>Detail ▸</a></small>
                                            </Col>
                                        </Card.Footer>
                                    </Card>
                                ))}

                                {vacancies.length === 0 && (
                                    <Col>
                                        <h5 className="m-5 d-flex justify-content-center align-items-center">Tidak ada post yang dibuat.</h5>
                                    </Col>
                                )}
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Container>
        </div>
    );
};


export default User;
