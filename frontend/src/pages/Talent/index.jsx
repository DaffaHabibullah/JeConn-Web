import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, OverlayTrigger, Tooltip, InputGroup, Form, Button, Image, Modal } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import { fetchUserProfile, fetchUserUpdateImage } from '../../api/User';
import { fetchTalentProfile, fetchTalentUpdate, fetchTalentUploadImage, fetchTalentAllImages } from '../../api/Talent';
import { fetchLocations } from '../../api/Locations';
import { fetchEntertainmentCategories } from '../../api/EntertainmentCategories';

const Talent = () => {
    const [userProfile, setUserProfile] = useState({
        imageProfile: ""
    });
    const [talentProfile, setTalentProfile] = useState({
        biography: "",
        location: "",
        isOpen: false,
        entertainment_id: []
    });
    const [talentImages, setTalentImages] = useState([]);
    const [locations, setLocations] = useState([]);
    const [entertainmentCategories, setEntertainmentCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchUserProfile();
                setUserProfile(response.data);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                throw error;
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    useEffect(() => {
        const fetchTalent = async () => {
            try {
                const response = await fetchTalentProfile();
                setTalentProfile(response.data);
            } catch (error) {
                console.error('Failed to fetch talent profile:', error);
                throw error;
            }
        };

        if (token) {
            fetchTalent();
        }
    }, [token]);

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

    useEffect(() => {
        const fetchEntertainment = async () => {
            try {
                const response = await fetchEntertainmentCategories();
                setEntertainmentCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch entertainment categories:', error);
                throw error;
            }
        };
    
        fetchEntertainment();
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const responseTalentId = await fetchTalentProfile();
                const talentId = responseTalentId.data._id;
    
                const response = await fetchTalentAllImages(talentId);
                setTalentImages(response.data);
            } catch (error) {
                console.error('Failed to fetch talent images:', error);
                throw error;
            }
        };
    
        if (token) {
            fetchImages();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setTalentProfile(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleEntertainmentChange = (e) => {
        const { value, checked } = e.target;
        setTalentProfile(prevState => {
            let entertainment_id = [...prevState.entertainment_id];
            if (checked) {
                entertainment_id.push(value);
            } else {
                entertainment_id = entertainment_id.filter(id => id !== value);
            }
            return {
                ...prevState,
                entertainment_id
            };
        });
    };

    const handleConfirmClick = async () => {
        try {
            await fetchTalentUpdate(
                talentProfile.biography,
                talentProfile.location,
                talentProfile.entertainment_id,
                talentProfile.isOpen
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

    const handleImageUpload = async (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            try {
                const response = await fetchTalentUploadImage(selectedImage);
                setTalentImages(prevImages => [...prevImages, response.data]);
            } catch (error) {
                console.error('Failed to upload image:', error);
            }
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }}>
                <Row className="d-flex justify-content-center align-items-center">
                    <Card className="d-flex flex-column" style={{ padding: '16px' }}>
                        <h2 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>Dashboard Talent and Images</h2>
                        <Row>
                            <Col xs={12} md={6} className="pt-3 d-flex flex-column align-items-center" style={{ borderBottom: '1px solid #00A47F' }}>
                                <OverlayTrigger placement="bottom" delay={{ show: 240, hide: 60 }} overlay={handleHoverImage}>
                                    <Card.Img
                                        variant="top"
                                        style={{ width: '192px', height: '192px', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
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
                                                <Form.Control id="fullName" type="text" aria-describedby="full-name" value={userProfile.fullName} disabled />
                                            </InputGroup>

                                            <InputGroup className="mt-3">
                                                <InputGroup.Text id="biography" style={{ width: '160px', backgroundColor: '#00A47F', color: '#FFFFFF', alignItems: 'start' }}>Biografi</InputGroup.Text>
                                                <Form.Control id="biography" style={{ minHeight: '80px' }} as="textarea" aria-describedby="biography" value={talentProfile.biography} onChange={handleInputChange} disabled={!isEditMode} />
                                            </InputGroup>

                                            <InputGroup className="mt-3">
                                                <InputGroup.Text id="locations" style={{ width: '160px', backgroundColor: '#00A47F', color: '#FFFFFF' }}>Lokasi</InputGroup.Text>
                                                <Form.Select id="location" aria-describedby="locations" value={talentProfile.location} onChange={handleInputChange} disabled={!isEditMode}>
                                                    {locations.map(location => (
                                                        <option key={location._id} value={location.name}>
                                                            {location.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </InputGroup>

                                            <InputGroup className="mt-3 d-flex align-items-center justify-content-center">
                                                <InputGroup.Text id="entertainment" style={{ width: '224px', backgroundColor: '#00A47F', color: '#FFFFFF' }}>Kategori Entertainment</InputGroup.Text>
                                                <Row className="mt-2 d-flex flex-wrap align-items-center">
                                                    {entertainmentCategories.map((category) => (
                                                        <Col key={category._id} md={5} xl={4}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                label={category.name}
                                                                value={category._id}
                                                                checked={talentProfile.entertainment_id.includes(category._id)}
                                                                onChange={handleEntertainmentChange}
                                                                disabled={!isEditMode}
                                                            />
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </InputGroup>
                                            
                                            <span className="mt-3 d-flex justify-content-center align-items-center">Status:</span>
                                            <InputGroup className="mt-1 d-flex justify-content-center align-items-center">
                                                <InputGroup.Text
                                                    id="isOpen"
                                                    style={{
                                                        marginRight: '16px',
                                                        backgroundColor: talentProfile.isOpen ? '#FFC107' : '#6C757D',
                                                        color: talentProfile.isOpen ? 'inherit' : '#FFFFFF',
                                                    }}
                                                >
                                                    {talentProfile.isOpen ? 'Opened' : 'Closed'}
                                                </InputGroup.Text>
                                                <Form.Check
                                                    id="isOpen"
                                                    type="switch"
                                                    checked={talentProfile.isOpen}
                                                    onChange={(e) => setTalentProfile(prevState => ({ ...prevState, isOpen: e.target.checked }))}
                                                    disabled={!isEditMode}
                                                    style={{ transform: 'scale(1.5)' }}
                                                />
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
                                                <Button variant="success" onClick={() => setIsEditMode(true)}>Edit Talent Profile</Button>
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Col>

                            <Col className="pt-4 d-flex flex-column align-items-center" style={{ paddingBottom: '48px', borderBottom: '1px solid #00A47F' }}>
                                <Col xs={12} className="mb-4 d-flex justify-content-between align-items-center">
                                    <h3>Your Talent Images</h3>
                                    <Button variant="outline-warning" onClick={() => document.getElementById('imageTalentInput').click()}>Upload Image</Button>
                                    <input type="file" id="imageTalentInput" accept=".jpg, .jpeg, .png" style={{ display: 'none' }} onChange={handleImageUpload} />
                                </Col>

                                <Col>
                                    <Row className="d-flex justify-content-center">
                                        {talentImages.map((imageUrl, index) => (
                                            <Col xs={6} md={6} xl={3} key={index} className="mt-3">
                                                <Card className="d-flex justify-content-center align-items-center border-0">
                                                    <a href={imageUrl} onClick={(e) => { e.preventDefault(); handleImageClick(imageUrl); }}>
                                                        <Image variant="top" src={imageUrl} style={{ width: '128px', height: '192px', objectFit: 'cover', cursor: 'pointer' }} rounded />
                                                    </a>
                                                </Card>
                                            </Col>
                                        ))}

                                        {talentImages.length === 0 && (
                                            <Col>
                                                <h5 className="m-5 d-flex justify-content-center align-items-center">Tidak ada gambar yang diupload.</h5>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Body>
                    <img src={selectedImage} alt="Selected Image" style={{ width: '100%', height: 'auto' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};


export default Talent;
