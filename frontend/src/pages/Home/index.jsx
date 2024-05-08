import { Container, Row, Col, Image, Button, Card, ListGroup, Badge } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import FooterComponent from '../../components/Footer';

const Home = () => {
    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }}>
                <Row className="d-flex justify-content-center align-items-center" style={{ paddingBottom: '64px' }}>
                    <Col md={7} className="d-flex justify-content-center align-items-center" style={{ padding: '16px' }}>
                        <Image style={{ width: '384px', height: '256px' }} src="images/thumbnail-image.jpg" alt="Thumbnail Image" thumbnail />
                    </Col>
                    <Col md={5} style={{ padding: '16px' }}>
                        <h3><b>Je<span style={{ color: '#00A47F' }}>Conn</span></b></h3>
                        <p>JeConn is a platform that connects job seekers with employers. We provide a platform for job seekers to find the right job and for employers to find the right candidates.</p>
                    </Col>
                </Row>
                <Container style={{ borderTop: '1px solid #00A47F' }}>
                    <Row className="d-flex" style={{ paddingBottom: '32px' }}>
                        <div className="d-flex justify-content-between" style={{ padding: '16px' }}>
                            <h3><b>Vacancies</b></h3>
                            <Button variant="success" className="me-2 mb-2" href="/vacancies">See All</Button>
                        </div>
                        <Card style={{ width: '18rem', marginRight: '32px', marginBottom: '32px' }}>
                            <Card.Body>
                                <Row className="mb-4">
                                    <Col md={3} className="d-flex justify-content-center align-items-center p-2">
                                        <Image variant="top" style={{ width: '50px', height: '50px' }} src="images/example-image.jpg" alt="Profile Image" roundedCircle />
                                    </Col>
                                    <Col>
                                        <Card.Title>Band Musics</Card.Title>
                                        <Card.Text>Jakarta</Card.Text>
                                    </Col>
                                </Row>
                                <Card.Text>
                                    Need a band musician to play guitar and drums.
                                    Need a band musician to play guitar and drums.
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer style={{ backgroundColor: '#FFFFFF'}}>
                                <Col className="d-flex justify-content-between">
                                    <small className="text-muted">Post 3 mins ago</small>
                                    <small className="text-muted"><a href="/" style={{ textDecoration: 'none', color: '#00A47F' }}>Detail</a></small>
                                </Col>
                            </Card.Footer>
                        </Card>
                        <Card style={{ width: '18rem', marginRight: '32px', marginBottom: '32px' }}>
                            <Card.Body>
                                <Row className="mb-4">
                                    <Col md={3} className="d-flex justify-content-center align-items-center p-2">
                                        <Image variant="top" style={{ width: '50px', height: '50px' }} src="images/example-image.jpg" alt="Profile Image" roundedCircle />
                                    </Col>
                                    <Col>
                                        <Card.Title>Band Musics</Card.Title>
                                        <Card.Text>Jakarta</Card.Text>
                                    </Col>
                                </Row>
                                <Card.Text>
                                    Need a band musician to play guitar and drums.
                                    Need a band musician to play guitar and drums.
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer style={{ backgroundColor: '#FFFFFF'}}>
                                <Col className="d-flex justify-content-between">
                                    <small className="text-muted">Post 3 mins ago</small>
                                    <small className="text-muted"><a href="/" style={{ textDecoration: 'none', color: '#00A47F' }}>Detail</a></small>
                                </Col>
                            </Card.Footer>
                        </Card>
                        <Card style={{ width: '18rem', marginRight: '32px', marginBottom: '32px' }}>
                            <Card.Body>
                                <Row className="mb-4">
                                    <Col md={3} className="d-flex justify-content-center align-items-center p-2">
                                        <Image variant="top" style={{ width: '50px', height: '50px' }} src="images/example-image.jpg" alt="Profile Image" roundedCircle />
                                    </Col>
                                    <Col>
                                        <Card.Title>Band Musics</Card.Title>
                                        <Card.Text>Jakarta</Card.Text>
                                    </Col>
                                </Row>
                                <Card.Text>
                                    Need a band musician to play guitar and drums.
                                    Need a band musician to play guitar and drums.
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer style={{ backgroundColor: '#FFFFFF'}}>
                                <Col className="d-flex justify-content-between">
                                    <small className="text-muted">Post 3 mins ago</small>
                                    <small className="text-muted"><a href="/" style={{ textDecoration: 'none', color: '#00A47F' }}>Detail</a></small>
                                </Col>
                            </Card.Footer>
                        </Card>
                    </Row>
                </Container>
                <Container style={{ borderTop: '1px solid #00A47F' }}>
                    <Row className="d-flex" style={{ paddingBottom: '32px' }}>
                        <div className="d-flex justify-content-between" style={{ padding: '16px' }}>
                            <h3><b>Talents</b></h3>
                            <Button variant="success" className="me-2 mb-2" href="/talents">See All</Button>
                        </div>
                        <Card style={{ width: '16rem', padding: "16px", marginRight: "32px", marginBottom: "32px" }}>
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
                        <Card style={{ width: '16rem', padding: "16px", marginRight: "32px", marginBottom: "32px" }}>
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
                        <Card style={{ width: '16rem', padding: "16px", marginRight: "32px", marginBottom: "32px" }}>
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
