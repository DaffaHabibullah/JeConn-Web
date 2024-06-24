import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, OverlayTrigger, Tooltip, InputGroup, Form, Badge, Button, Modal } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import { fetchUserProfile, fetchUserUpdate, fetchUserUpdateImage } from '../../api/User';
import { fetchPostVacancies, fetchPostVacanciesById } from '../../api/Vacancies';
import { fetchLocations } from '../../api/Locations';
import { fetchEntertainmentCategories } from '../../api/EntertainmentCategories';
import { useNotification } from '../../components/Notification';

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
    const [showModal, setShowModal] = useState(false);
    const [newPost, setNewPost] = useState({
        typePost: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        address: '',
        description: '',
        candidates: '',
        salary: '',
        typeSalary: 'hour',
        entertainment_id: []
    });
    const [locations, setLocations] = useState([]);
    const [entertainmentCategories, setEntertainmentCategories] = useState([]);
    const { showNotification } = useNotification();
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
                showNotification('Failed to fetch data', false);
            }
        };

        const fetchData = async () => {
            try {
                const locationsResponse = await fetchLocations();
                setLocations(locationsResponse.data);

                const entertainmentResponse = await fetchEntertainmentCategories();
                setEntertainmentCategories(entertainmentResponse.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        if (token) {
            fetchUserAndVacancies();
            fetchData();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserProfile(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleNewPostChange = (e) => {
        const { id, value } = e.target;
        setNewPost(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleConfirmClick = async () => {
        try {
            if (userProfile.fullName.length === 0) {
                showNotification('Full name cannot be empty', false);
                return;
            }
            if (userProfile.address.length < 16 || userProfile.address.length < 256) {
                showNotification('Address must be at least 16 characters and at most 256 characters', false);
                return;
            }
            if (userProfile.phoneNumber.length < 11 || userProfile.phoneNumber.length > 13) {
                showNotification('Phone number must be at least 11 characters and at most 13 characters', false);
                return;
            }

            const response = await fetchUserUpdate(
                userProfile.fullName,
                userProfile.dateOfBirth,
                userProfile.gender,
                userProfile.address,
                userProfile.phoneNumber
            );
            setIsEditMode(false);
            showNotification(response.message);
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleNewPostSubmit = async () => {
        try {
            const response = await fetchPostVacancies(
                newPost.typePost,
                newPost.title,
                newPost.location,
                newPost.startDate,
                newPost.endDate,
                newPost.address,
                newPost.description,
                newPost.candidates,
                newPost.salary,
                newPost.typeSalary,
                newPost.entertainment_id
            );
            setShowModal(false);
            
            setNewPost({
                typePost: '',
                title: '',
                location: '',
                startDate: '',
                endDate: '',
                address: '',
                description: '',
                candidates: '',
                salary: '',
                typeSalary: '',
                entertainment_id: []
            });
    
            const userResponse = await fetchUserProfile();
            const vacanciesPromises = userResponse.data.vacanciesId.map(id => fetchPostVacanciesById(id));
            const vacanciesResults = await Promise.all(vacanciesPromises);
            const sortedVacancies = vacanciesResults.map(result => result.data).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setVacancies(sortedVacancies);
            showNotification(response.message);
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleEntertainmentChange = (e) => {
        const { value, checked } = e.target;
        setNewPost(prevState => {
            let entertainment_id = [...prevState.entertainment_id];
            if (checked) {
                entertainment_id.push(value);
            } else {
                entertainment_id = entertainment_id.filter(id => id!== value);
            }
            return {
                ...prevState,
                entertainment_id
            };
        });
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
                const response = await fetchUserUpdateImage(selectedImage);
                setUserProfile(prevState => ({
                    ...prevState,
                    imageProfile: URL.createObjectURL(selectedImage)
                }));
                showNotification(response.message);
            } catch (error) {
                showNotification(error.response.data.message, false);
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

                            <Col md={6} className="pt-4" style={{ paddingBottom: '48px', borderBottom: '1px solid #00A47F' }}>
                                <Col xs={12} className="mb-4 d-flex justify-content-between align-items-center">
                                    <h3>Your Vacancies Post</h3>
                                    <Button variant="success" onClick={() => setShowModal(true)}>New Post</Button>
                                </Col>
                                
                                {vacancies.map((vacancy, index) => (
                                    <Card key={index} style={{ width: '95%', margin: 'auto', marginBottom: '32px' }}>
                                        <Card.Body>
                                            <Row className="mb-4">
                                                <Col xs={8} md={8} xl={10} style={{ maxHeight: '7rem' }}>
                                                    <Card.Title><a href={`/vacancies/post/${vacancy._id}`} style={{ textDecoration: 'none', color: '#000000', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{vacancy.title}</a></Card.Title>
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
                                            <span className="text-end" style={{ position: 'absolute', right: '8px', top: '48px' }}>{vacancy.candidates} <br /> Candidates</span>
                                            <Card.Text style={{ whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
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

            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Vacancy Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipe Post</Form.Label>
                            <Form.Select id="typePost" value={newPost.typePost} onChange={handleNewPostChange}>
                                <option value="" disabled>Pilih tipe post</option>
                                <option value="Offer">Offer</option>
                                <option value="Event">Event</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Judul</Form.Label>
                            <Form.Control id="title" type="text" value={newPost.title} onChange={handleNewPostChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Lokasi</Form.Label>
                            <Form.Select id="location" value={newPost.location} onChange={handleNewPostChange}>
                                <option value="" disabled>Pilih lokasi</option>
                                {locations.map((location) => (
                                    <option key={location._id} value={location._id}>{location.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Kandidat</Form.Label>
                            <InputGroup>
                                <Form.Control id="candidates" type="number" value={newPost.candidates} onChange={handleNewPostChange} />
                                <InputGroup.Text>kandidat</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Bayaran</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>IDR.</InputGroup.Text>
                                <Col xs={6} md={8} xl={9}>
                                    <Form.Control id="salary" type="number" value={newPost.salary} onChange={handleNewPostChange} />
                                </Col>

                                <Col>
                                    <Form.Select id="typeSalary" value={newPost.typeSalary} onChange={handleNewPostChange}>
                                        <option value="hour">hour</option>
                                        <option value="day">day</option>
                                    </Form.Select>
                                </Col>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tanggal Mulai</Form.Label>
                            <InputGroup>
                                <Form.Control id="startDate" type="date" value={newPost.startDate} onChange={handleNewPostChange} />
                                <Col xs={2} xl={1} className="text-center d-flex justify-content-center align-items-center">
                                    <span>s/d</span>
                                </Col>
                                <Form.Control id="endDate" type="date" value={newPost.endDate} onChange={handleNewPostChange} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Alamat Lengkap</Form.Label>
                            <Form.Control id="address" as="textarea" rows={3} value={newPost.address} onChange={handleNewPostChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Keterangan</Form.Label>
                            <Form.Control id="description" as="textarea" rows={3} value={newPost.description} onChange={handleNewPostChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Kategori Entertainment</Form.Label>
                            <Row className="mt-2 d-flex flex-wrap align-items-start">
                                {entertainmentCategories.map((category) => (
                                    <Col key={category._id} xs={6} md={4} xl={4}>
                                        <Form.Check
                                            type="checkbox"
                                            label={category.name}
                                            value={category._id}
                                            checked={newPost.entertainment_id.includes(category._id)}
                                            onChange={handleEntertainmentChange}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleNewPostSubmit}>Create Post</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


export default User;
