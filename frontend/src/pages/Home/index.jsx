import { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Card, ListGroup, Badge } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import FooterComponent from '../../components/Footer';
import { fetchAllPostVacancies } from '../../api/Vacancies';

const Home = () => {
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        fetchAllPostVacancies().then((response) => {
            const sortedVacancies = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setVacancies(sortedVacancies.slice(0, 5));
        });
    }, []);

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
                <Row className="d-flex justify-content-center align-items-center" style={{ paddingBottom: '96px' }}>
                    <Col md={7} className="d-flex justify-content-center align-items-center" style={{ padding: '16px' }}>
                        <Image style={{ width: '384px', height: '256px' }} src="images/thumbnail-image.jpg" alt="Thumbnail Image" thumbnail />
                    </Col>
                    <Col md={5} style={{ padding: '16px' }}>
                        <h3><b>Je<span style={{ color: '#00A47F' }}>Conn</span></b></h3>
                        <p>JeConn is a platform that connects job seekers with employers. We provide a platform for job seekers to find the right job and for employers to find the right candidates.</p>
                    </Col>
                </Row>
                <Container style={{ borderTop: '1px solid #00A47F' }}>
                    <Row style={{ paddingBottom: '64px' }}>
                        <div className="d-flex justify-content-between" style={{ padding: '16px' }}>
                            <h3><b>New Vacancies</b></h3>
                            <Button variant="success" className="me-2 mb-2" href="/vacancies">See All</Button>
                        </div>

                        {vacancies.map((vacancy, index) => (
                            <Card key={index} style={{ maxWidth: '24rem', marginRight: '32px', marginBottom: '32px' }}>
                                <Card.Body style={{ position: 'relative', paddingLeft: '8px', paddingRight: '8px' }}>
                                    <Row className="mb-4">
                                        <Col xs={7} md={8} xl={10} style={{ maxHeight: '7rem' }}>
                                            <Card.Title><a href={`/vacancies/post/${vacancy._id}`} style={{ textDecoration: 'none', color: '#000000' }}>{vacancy.title}</a></Card.Title>
                                            <Card.Text>{vacancy.location}</Card.Text>
                                        </Col>
                                    </Row>
                                    <span className="text-center" style={{ position: 'absolute', right: '8px', top: '16px' }}>
                                        <Badge bg={ vacancy.status ? 
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
                                <Card.Footer style={{ paddingLeft: '8px', paddingRight: '8px', backgroundColor: '#FFFFFF'}}>
                                    <Col className="d-flex justify-content-between">
                                        <small className="text-muted">{getTimeAgo(vacancy.createdAt).toLocaleString()}</small>
                                        <small className="text-muted"><a href={`/vacancies/post/${vacancy._id}`} style={{ textDecoration: 'none', color: '#00A47F' }}>Detail ▸</a></small>
                                    </Col>
                                </Card.Footer>
                            </Card>
                        ))}

                        {vacancies.length === 0 && (
                            <Col>
                                <h5 className="m-5 text-center">Loading ...</h5>
                            </Col>
                        )}
                    </Row>
                </Container>

                <Container style={{ borderTop: '1px solid #00A47F' }}>
                    <Row className="d-flex" style={{ paddingBottom: '64px' }}>
                        <div className="d-flex justify-content-between" style={{ padding: '16px' }}>
                            <h3><b>Talents</b></h3>
                            <Button variant="success" className="me-2 mb-2" href="/talents">See All</Button>
                        </div>
                        <Card style={{ width: '16rem', padding: "16px", marginLeft: "32px", marginBottom: "32px" }}>
                            <Card.Img variant="top" style={{ height: '192px' }} src="images/example-image.jpg" alt="Profile Image" />
                            <Card.Body>
                                <Card.Title><a href="/" style={{ textDecoration: 'none', color: '#000000' }}>Pesulap</a></Card.Title>
                                <Card.Text>
                                    Saya seorang pesulap yang hebat.
                                </Card.Text>
                            </Card.Body>
                            <Badge bg="success" style={{ position: 'absolute', top: '16px', right: '16px' }}>Jakarta</Badge>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    <h6>
                                        <Badge bg="success" className="me-2 mb-2">MC</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Cosplayer</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Badut</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Pesulap</Badge>
                                    </h6>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Card style={{ width: '16rem', padding: "16px", marginLeft: "32px", marginBottom: "32px" }}>
                            <Card.Img variant="top" style={{ height: '192px' }} src="images/example-image.jpg" alt="Profile Image" />
                            <Card.Body>
                                <Card.Title><a href="/" style={{ textDecoration: 'none', color: '#000000' }}>Pesulap</a></Card.Title>
                                <Card.Text>
                                    Saya seorang pesulap yang hebat.
                                </Card.Text>
                            </Card.Body>
                            <Badge bg="success" style={{ position: 'absolute', top: '16px', right: '16px' }}>Jakarta</Badge>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    <h6>
                                        <Badge bg="success" className="me-2 mb-2">MC</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Cosplayer</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Badut</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Pesulap</Badge>
                                    </h6>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Card style={{ width: '16rem', padding: "16px", marginLeft: "32px", marginBottom: "32px" }}>
                            <Card.Img variant="top" style={{ height: '192px' }} src="images/example-image.jpg" alt="Profile Image" />
                            <Card.Body>
                                <Card.Title><a href="/" style={{ textDecoration: 'none', color: '#000000' }}>Pesulap</a></Card.Title>
                                <Card.Text>
                                    Saya seorang pesulap yang hebat.
                                </Card.Text>
                            </Card.Body>
                            <Badge bg="success" style={{ position: 'absolute', top: '16px', right: '16px' }}>Jakarta</Badge>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    <h6>
                                        <Badge bg="success" className="me-2 mb-2">MC</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Cosplayer</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Badut</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Pesulap</Badge>
                                    </h6>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Card style={{ width: '16rem', padding: "16px", marginLeft: "32px", marginBottom: "32px" }}>
                            <Card.Img variant="top" style={{ height: '192px' }} src="images/example-image.jpg" alt="Profile Image" />
                            <Card.Body>
                                <Card.Title><a href="/" style={{ textDecoration: 'none', color: '#000000' }}>Pesulap</a></Card.Title>
                                <Card.Text>
                                    Saya seorang pesulap yang hebat.
                                </Card.Text>
                            </Card.Body>
                            <Badge bg="success" style={{ position: 'absolute', top: '16px', right: '16px' }}>Jakarta</Badge>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    <h6>
                                        <Badge bg="success" className="me-2 mb-2">MC</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Cosplayer</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Badut</Badge>
                                        <Badge bg="success" className="me-2 mb-2">Pesulap</Badge>
                                    </h6>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Row>
                </Container>
            </Container>
            <FooterComponent />
        </div>
    );
};


export default Home;
