import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Button, Form, InputGroup, OverlayTrigger, Tooltip, Modal, Badge } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar";
import { fetchUserProfile } from '../../api/User';
import { fetchPostVacanciesById, fetchUpdateVacancies, fetchDeleteVacancies, fetchSubmitVacancies, fetchUpdateStatusCandidate } from '../../api/Vacancies';
import { fetchTalentByUsername } from '../../api/Talent';
import { fetchEntertainmentCategories } from '../../api/EntertainmentCategories';
import { fetchCreateMessageRoom } from '../../api/Messages';
import { useNotification } from '../../components/Notification';

const DetailVaTal = () => {
    const [data, setData] = useState({});
    const [entertainmentCategories, setEntertainmentCategories] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [updatePost, setUpdatePost] = useState({
        title: '',
        startDate: '',
        endDate: '',
        address: '',
        description: '',
        candidates: '',
        salary: '',
        typeSalary: '',
        entertainment_id: [],
        status: '',
        });
    const [showModalAllCandidates, setShowModalAllCandidates] = useState(false);
    const [showModalImage, setShowModalImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const { showNotification } = useNotification();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile().then((response) => {
            setUserProfile(response.data);
        }).catch((error) => {
            console.error('Failed to fetch user profile:', error);
            throw error;
        });

        if (location.pathname.includes("/vacancies")) {
            fetchPostVacanciesById(location.pathname.split("/")[3]).then((response) => {
                setData(response.data);
            });
        } else if (location.pathname.includes("/talent")) {
            fetchTalentByUsername(location.pathname.split("/")[3]).then((response) => {
                setData(response.data);
            });
        }
    }, [location]);

    useEffect(() => {
        const fetchEntertainment = async () => {
            try {
                const response = await fetchEntertainmentCategories();
                setEntertainmentCategories(response.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };
    
        fetchEntertainment();
    }, []);

    const getEntertainmentName = (id) => {
        const category = entertainmentCategories.find(entertainment => entertainment._id === id);
        return category ? category.name : "Unknown";
    };

    const handleEntertainmentChange = (e) => {
        const { value, checked } = e.target;
        setUpdatePost(prevState => {
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

    const handleUpdatePostChange = (e) => {
        const { id, value } = e.target;
        setUpdatePost(prevState => ({
            ...prevState,
            [id]: value
        }));
    };
            
    const fillUpdatePostData = () => {
        setUpdatePost({
            typePost: data.typePost,
            title: data.title,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            address: data.address,
            description: data.description,
            candidates: data.candidates,
            salary: data.salary,
            typeSalary: data.typeSalary,
            entertainment_id: data.entertainment_id || [],
            status: data.status
        });
    };

    const handleUpdatePostSubmit = async () => {
        try {
            if (updatePost.title === '' || updatePost.startDate === '' || updatePost.endDate === '' || 
                updatePost.address === '' || updatePost.description === '' || updatePost.candidates === '' || 
                updatePost.salary === '' || updatePost.typeSalary === '' || updatePost.entertainment_id.length < 1 || updatePost.status === ''
            ) {
                showNotification('All fields must be filled.', false);
                return;
            }

            if (updatePost.candidates < 1 || updatePost.candidates > 999) {
                showNotification('Candidates must be at least 1 and at most 999.', false);
                return;
            }
            if (updatePost.salary < 1) {
                showNotification('Salary must be at least 1.', false);
                return;
            }

            const response = await fetchUpdateVacancies(
                data._id,
                updatePost.title,
                updatePost.startDate,
                updatePost.endDate,
                updatePost.address,
                updatePost.description,
                updatePost.candidates,
                updatePost.salary,
                updatePost.typeSalary,
                updatePost.entertainment_id,
                updatePost.status
            );            
            showNotification(response.message);
            setShowModal(false);

            fetchPostVacanciesById(location.pathname.split("/")[3]).then((response) => {
                setData(response.data);
            });
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleSubmitVacancy = async () => {
        try {
            const response = await fetchSubmitVacancies(data._id);
            showNotification(response.message);

            fetchPostVacanciesById(location.pathname.split("/")[3]).then((response) => {
                setData(response.data);
            });
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleDeleteVacancy = async () => {
        try {
            const response = await fetchDeleteVacancies(data._id);
            showNotification(response.message);

            navigate(-1);

            fetchPostVacanciesById(location.pathname.split("/")[3]).then((response) => {
                setData(response.data);
            });
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleClickShowModalAllCandidates = () => {
        setShowModalAllCandidates(true);
    };

    const handleUpdateStatus = async (username, status) => {
        try {
            const response = await fetchUpdateStatusCandidate(data._id, username, status);
            showNotification(response.message);

            fetchPostVacanciesById(location.pathname.split("/")[3]).then((response) => {
                setData(response.data);
            });
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleHoverImage = (candidate) => (
        <Tooltip>
            {candidate.username === userProfile.username ? (
                `You`
            ) : (
                `${candidate.username}`
            )}
        </Tooltip>
    );

    const handleImageClickShowModalImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModalImage(true);
    };

    const handleChatClick = async (username) => {
        try {
            const response = await fetchCreateMessageRoom(username);
    
            if (response.success) {
                navigate(`/chat/${response.data._id}`);
            } else {
                console.error('Failed to create or find message room:', response.message);
            }
        } catch (error) {
            console.error('Failed to create message room and navigate:', error);
        }
    };

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

    const isAuthor = userProfile.username === data.username;
    const isTalent = userProfile.roles && userProfile.roles.includes('talent');
    const hasSubmitted = data.allCandidates && data.allCandidates.some(candidate => candidate.username === userProfile.username);

    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }}>
                <Row className="d-flex justify-content-center align-items-center">
                    {location.pathname.includes("vacancies") ? (
                        <Card className="d-flex flex-column" style={{ padding: '16px' }}>
                            <h3 style={{ marginBottom: '32px', borderBottom: '1px solid #00A47F' }}>
                                <a href="#" onClick={() => navigate(-1)} style={{ textDecoration: 'none' }}><i className="fa-solid fa-arrow-left" style={{ color: '#00A47F' }}></i> </a>
                                Back
                            </h3>
                            <h4 className="mb-3">{data.title}</h4>
                            <Row className="m-0">
                                <Col xs={4} md={2} xl={1} className="d-flex justify-content-center align-items-center p-2">
                                    <Image src={data.imageProfile} style={{ width: '72px', height: '72px', objectFit: 'cover' }} roundedCircle />
                                </Col>
                                <Col xs={8} md={10} xl={11} className="d-block p-0 pt-3" style={{ maxHeight: '7rem' }}>
                                    <Card.Title>{data.username}</Card.Title>
                                    <Card.Text>{data.location}</Card.Text>
                                </Col>
                            </Row>
                            <Card.Body style={{ marginBottom: '8px' }}>
                                <Row style={{ paddingBottom: '16px', borderBottom: '1px solid #00A47F' }}>
                                    <span className="d-flex align-items-center mb-1"><img src="/icon/people-icon.png" style={{ marginRight: '4px' }} /><span style={{ paddingRight: '4px' }}>Candidates</span> : {data.candidates} candidate</span>
                                    <span className="d-flex align-items-center mb-1"><img src="/icon/dollar-icon.png" style={{ marginRight: '4px' }} /><span style={{ paddingRight: '41px' }}>Salary</span> : IDR {data.salary} /{data.typeSalary}</span>
                                    <span className="d-flex align-items-center mb-1"><img src="/icon/date-icon.png" style={{ marginRight: '4px' }} /><span style={{ paddingRight: '53px'  }}>Date</span> : {data.startDate} - {data.endDate}</span>
                                </Row>
                                <Card.Text style={{ paddingTop: '16px' }}>
                                    <h6>Type Post :</h6>

                                    <span
                                        style={{
                                            backgroundColor: data.status ? (data.typePost === 'Event' ? '#FFC107' : '#198754') : "#6C757D",
                                            padding: '2px 6px', 
                                            borderRadius: '5px',
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        {data.typePost}
                                    </span>
                                </Card.Text>

                                <Card.Text style={{ paddingTop: '8px' }}>
                                    <h6>Entertainment Categories :</h6>

                                    <span>
                                        {(data.entertainment_id || []).map(entertainmentId => (
                                            <Badge key={entertainmentId} bg="success" className="me-2 mb-2">{getEntertainmentName(entertainmentId)}</Badge>
                                        ))}
                                    </span>
                                </Card.Text>
                                
                                <Card.Text style={{ paddingTop: '4px' }}>
                                    {isAuthor ? (
                                        <h6>
                                            <a href="#" onClick={handleClickShowModalAllCandidates} style={{ color: '#000000' }}>All Candidates <i className="fa-solid fa-caret-right"></i></a>
                                        </h6>
                                    ) : (
                                        <h6>All Candidates :</h6>
                                    )}
                                    
                                    <Row className="m-0" style={{ position: 'relative', paddingBottom: '48px' }}>
                                        {data.allCandidates && data.allCandidates.length > 0 ? (
                                            data.allCandidates.map((candidate, index) => (
                                                <Col key={candidate._id} xs={1} md={1} xl={1} className="p-0" style={{ position: 'absolute', left: `${index * 52}px` }}>
                                                    <a href={`/talent/profile/${candidate.username}`}>
                                                        <OverlayTrigger placement="bottom" delay={{ show: 240, hide: 60 }} overlay={handleHoverImage(candidate)}>
                                                            <Image src={candidate.imageProfile} style={{ width: '48px', height: '48px', objectFit: 'cover', cursor: 'pointer' }} roundedCircle />
                                                        </OverlayTrigger>
                                                    </a>
                                                </Col>
                                            ))
                                        ) : (
                                            <span>—No candidates—</span>
                                        )}
                                    </Row>
                                </Card.Text>

                                <Card.Text style={{ whiteSpace: 'pre-wrap', paddingTop: '8px' }}>
                                    <Row>
                                        <Col style={{ borderTop: '1px solid #00A47F', paddingBottom: '16px', paddingTop: '16px' }} md={5} xl={4}>
                                            <h6>Address :</h6>
                                            <p>{data.address}</p>
                                        </Col>

                                        <Col style={{ borderTop: '1px solid #00A47F', paddingBottom: '16px', paddingTop: '16px' }} md={7} xl={8}>
                                            <h6>Description :</h6>
                                            <p>{data.description}</p>
                                        </Col>
                                    </Row>
                                </Card.Text>

                                <small style={{ position: 'absolute', left: '18px' }}>
                                    Posted at: {getTimeAgo(data.createdAt).toLocaleString()}
                                </small>

                                <small style={{ position: 'absolute', right: '18px', top: '16px' }}>
                                    {data.createdAt!== data.updatedAt? `*Updated: ${getTimeAgo(data.updatedAt).toLocaleString()}` : ''}
                                </small>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-end align-items-center m-0 p-0" style={{ borderColor: '#00A47F', backgroundColor: '#FFFFFF' }}>
                                {isAuthor && (
                                    <>
                                        <Button variant="success" onClick={() => { setShowModal(true); fillUpdatePostData(); }} style={{ marginTop: '16px', padding: '6px 16px' }}>Edit</Button>
                                        <Button variant="danger" onClick={handleDeleteVacancy} style={{ marginTop: '16px', marginLeft: '16px', padding: '6px 16px' }}>Delete</Button>
                                    </>
                                )}

                                {!isAuthor && isTalent && data.status && (
                                    <>
                                        {!hasSubmitted ? (
                                            <Button variant="warning" onClick={handleSubmitVacancy} style={{ width: '100%', marginTop: '16px', padding: '6px 16px' }}>
                                                Submit as a candidate
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" style={{ width: '100%', marginTop: '16px', padding: '6px 16px' }} disabled>
                                                Submitted
                                            </Button>
                                        )}
                                        <Button variant="success" onClick={() => handleChatClick(data.username)} style={{ marginTop: '16px', marginLeft: '16px', padding: '6px 32px' }}>Chat</Button>
                                    </>
                                )}

                                {!isAuthor && isTalent && hasSubmitted && !data.status && (
                                    <Button variant="success" onClick={() => handleChatClick(data.username)} style={{ width: '100%', marginTop: '16px', padding: '6px 16px' }}>Chat</Button>
                                )}
                            </Card.Footer>
                        </Card>
                    ) : (
                        <Card className="d-flex flex-column" style={{ padding: '16px' }}>
                            <h3 style={{ marginBottom: '32px', borderBottom: '1px solid #00A47F' }}>
                                <a href="#" onClick={() => navigate(-1)} style={{ textDecoration: 'none' }}><i className="fa-solid fa-arrow-left" style={{ color: '#00A47F' }}></i> </a>
                                Back
                            </h3>
                            <Row>
                                <Col xs={12} md={6} xl={7} className="pt-3 d-flex flex-column align-items-center" style={{ borderBottom: '1px solid #00A47F' }}>
                                    <Card.Img
                                        style={{ width: '192px', height: '192px', padding: '8px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #00A47F' }} 
                                        src={data.imageProfile} 
                                        alt="Profile Image" 
                                    />

                                    <Card.Body className="d-flex flex-column" style={{ width: '100%' }}>
                                        <Card.Title className="mb-3 text-center"><b>{data.username}</b></Card.Title>
                                        <Row>
                                            <Card.Text>
                                                <h6>
                                                    <img src="/icon/location-icon.png" style={{ marginRight: '4px' }} />
                                                    Location :
                                                </h6>
                                                {data.location}
                                            </Card.Text>

                                            <Card.Text>
                                                <h6>
                                                    Status Open :
                                                </h6>
                                                <span style={{ padding: '4px', backgroundColor: data.isOpen ? '#FFC107' : '#6C757D', color: data.isOpen ? 'inherit' : '#FFFFFF', borderRadius: '5px' }}>
                                                    {data.isOpen ? 'Opened' : 'Closed'}
                                                </span>
                                            </Card.Text>
                                            
                                            <Card.Text>
                                                <h6>Entertainmet Categories :</h6>
                                                {(data.entertainment_id || []).map(entertainment => (
                                                    <Badge key={entertainment} bg="success" className="me-2 mb-2">{entertainment}</Badge>
                                                ))}
                                            </Card.Text>

                                            <Card.Text style={{ whiteSpace: 'pre-wrap', paddingTop: '8px', borderTop: '1px solid #00A47F', paddingBottom: '16px' }}>
                                                <h6 style={{ marginTop: '16px' }}>Biography :</h6>
                                                <p>{data.biography}</p>
                                            </Card.Text>
                                        </Row>
                                    </Card.Body>
                                </Col>

                                <Col className="pt-3" style={{ borderBottom: '1px solid #00A47F' }}>
                                    <Card.Title>Talent Images :</Card.Title>
                                    <Card.Body>
                                        <Row xs={2} md={2} lg={3} className="m-0 g-2 d-flex justify-content-start">
                                            {data.images && data.images.length > 0 ? (
                                                data.images.map((imageUrl, index) => (
                                                    <Col key={index} className="mb-2 d-flex justify-content-center align-items-center">
                                                        <Card className="position-relative border-0">
                                                            <a href={imageUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); handleImageClickShowModalImage(imageUrl); }}>
                                                                <Image variant="top" src={imageUrl} style={{ width: '128px', height: '192px', objectFit: 'cover', cursor: 'pointer' }} rounded />
                                                            </a>
                                                        </Card>
                                                    </Col>
                                                ))
                                            ) : (
                                                <p>No images available.</p>
                                            )}
                                        </Row>
                                    </Card.Body>
                                </Col>
                            </Row>
                            <Card.Footer className="d-flex justify-content-end align-items-center m-0 p-0" style={{ backgroundColor: '#FFFFFF' }}>
                                {isAuthor ? (
                                    <Button href="/talent-profile" variant="warning" style={{ marginTop: '16px', padding: '6px 16px' }}>Update</Button>
                                ) : (
                                    <Button variant="success" onClick={() => handleChatClick(data.username)} style={{ width: '100%', marginTop: '16px', padding: '6px 16px' }}>Chat</Button>
                                )}
                            </Card.Footer>
                        </Card>
                    )}
                </Row>
            </Container>
            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Vacancy Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipe Post</Form.Label>
                            <Form.Control id="typePost" type="text" value={updatePost.typePost} onChange={handleUpdatePostChange} disabled readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Judul</Form.Label>
                            <Form.Control id="title" type="text" value={updatePost.title} minLength={8} maxLength={36} onChange={handleUpdatePostChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Lokasi</Form.Label>
                            <Form.Control id="location" type="text" value={updatePost.location} onChange={handleUpdatePostChange} disabled readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Kandidat</Form.Label>
                            <InputGroup>
                                <Form.Control id="candidates" type="number" value={updatePost.candidates} onChange={handleUpdatePostChange} />
                                <InputGroup.Text>kandidat</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Bayaran</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>IDR.</InputGroup.Text>
                                <Col xs={6} md={8} xl={9}>
                                    <Form.Control id="salary" type="number" value={updatePost.salary} onChange={handleUpdatePostChange} />
                                </Col>

                                <Col>
                                    <Form.Select id="typeSalary" value={updatePost.typeSalary} onChange={handleUpdatePostChange}>
                                        <option value="hour">hour</option>
                                        <option value="day">day</option>
                                    </Form.Select>
                                </Col>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tanggal Mulai</Form.Label>
                            <InputGroup>
                                <Form.Control id="startDate" type="date" value={updatePost.startDate} onChange={handleUpdatePostChange} />
                                <Col xs={2} xl={1} className="text-center d-flex justify-content-center align-items-center">
                                    <span>s/d</span>
                                </Col>
                                <Form.Control id="endDate" type="date" value={updatePost.endDate} onChange={handleUpdatePostChange} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Alamat Lengkap</Form.Label>
                            <Form.Control id="address" as="textarea" rows={3} value={updatePost.address} minLength={16} maxLength={256} onChange={handleUpdatePostChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Keterangan</Form.Label>
                            <Form.Control id="description" as="textarea" rows={3} value={updatePost.description} minLength={16} maxLength={256} onChange={handleUpdatePostChange} />
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
                                            checked={updatePost.entertainment_id.includes(category._id)}
                                            onChange={handleEntertainmentChange}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status Post</Form.Label>
                            <InputGroup className="d-flex align-items-center">
                                <InputGroup.Text 
                                    id="status" 
                                    style={{ 
                                        marginRight: '16px',
                                        backgroundColor: updatePost.status ? '#198754' : '#6C757D',
                                        color: '#FFFFFF', }}>
                                    {updatePost.status ? 'Opened' : 'Closed'}
                                </InputGroup.Text>
                                <Form.Check
                                    id="status"
                                    type="switch"
                                    checked={updatePost.status}
                                    onChange={(e) => setUpdatePost(prevState => ({ ...prevState, status: e.target.checked }))}
                                    style={{ transform: 'scale(1.5)' }}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleUpdatePostSubmit}>Update Post</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalAllCandidates} onHide={() => setShowModalAllCandidates(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>All Candidates :</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {data.allCandidates && data.allCandidates.length > 0? (
                        data.allCandidates.map((candidate, index) => (
                            <div key={index} className="position-relative mb-3 p-2 border rounded">
                                <Row className="m-0">
                                    <Col xs={3} md={2} xl={2} className="d-flex justify-content-center align-items-center p-2">
                                        <Image src={candidate.imageProfile} style={{ width: '64px', height: '64px', objectFit: 'cover' }} roundedCircle />
                                    </Col>
                                    <Col xs={5} md={7} xl={7} className="d-block p-0 pt-3" style={{ maxHeight: '7rem' }}>
                                        <Card.Title className="pb-1">
                                            <a href={`/talent/profile/${candidate.username}`} style={{ textDecoration: 'none', color: '#000000' }}>
                                                {candidate.username}
                                            </a>
                                        </Card.Title>
                                        <Card.Text>Submitted at: {getTimeAgo(candidate.timestamp).toLocaleString()}</Card.Text>
                                    </Col>
                                </Row>
                                <div style={{ position: 'absolute', right: '14px', top: '32px' }}>
                                    {candidate.status === 'pending' ? (
                                        <>
                                            <Button variant="success" size="sm" onClick={() => handleUpdateStatus(candidate.username, 'approved')}><i className="fa-solid fa-check" style={{ backgroundColor: '#198754', color: '#FFFFFF' }}></i></Button>
                                            <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(candidate.username, 'rejected')} style={{ marginLeft: '8px' }}><i className="fa-solid fa-xmark" style={{ backgroundColor: '#DC3545', color: '#FFFFFF' }}></i></Button>
                                        </>
                                    ) : (
                                        <span style={{ color: candidate.status === 'approved' ? '#198754' : candidate.status === 'rejected' ? '#DC3545' : '#FFC107' }}>
                                            {candidate.status === 'approved' ? '[Approved]' : candidate.status === 'rejected' ? '[Rejected]' : '[Pending]'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No candidates found.</p>
                    )}
                </Modal.Body>
            </Modal>
            
            <Modal show={showModalImage} onHide={() => setShowModalImage(false)} size="lg" centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedImage} alt="Selected Image" style={{ width: '100%', height: 'auto' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
}


export default DetailVaTal;
