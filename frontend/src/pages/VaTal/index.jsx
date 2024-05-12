import { Container, Row, Col, Card, Image, Badge } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar";
import SearchbarComponent from "../../components/Searchbar";
import FooterComponent from "../../components/Footer";

const VaTal = () => {
    return (
        <div>
            <NavbarComponent />
            <SearchbarComponent />
            <Container style={{ marginTop: '16px' }}>
                <Row className="d-flex justify-content-center align-items-center" style={{ paddingBottom: '64px' }}>
                    <Card style={{ width: '72rem', marginTop: '32px' }}>
                        <Card.Body style={{ maxHeight: '512px' }}>
                            <Badge bg="success" style={{ position: 'absolute', top: '16px', right: '16px' }}>IDR: 100.000</Badge>
                            <Row className="mb-4">
                                <Col md={2} xl={1} className="d-flex justify-content-center align-items-center p-2">
                                    <Image variant="top" style={{ width: '65px', height: '65px' }} src="images/example-image.jpg" alt="Profile Image" roundedCircle />
                                </Col>
                                <Col className="d-block m-auto">
                                    <Card.Title>
                                        <a href="#" style={{ textDecoration: 'none', color: '#000000' }}>Band Musics</a>
                                    </Card.Title>
                                    <Card.Text>Jakarta</Card.Text>
                                </Col>
                            </Row>
                            <Card.Text style={{ paddingBottom: '8px' }}>
                                Need a band musician to play guitar and drums.
                                Need a band musician to play guitar and drums.
                                Need a band musician to play guitar and drums.
                                Need a band musician to play guitar and drums.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer style={{ backgroundColor: '#FFFFFF'}}>
                            <Col className="d-flex justify-content-between">
                                <Row>
                                    <span className="mb-2">
                                        Entertainment Category:
                                            <Badge style={{ marginLeft: '8px'}} bg="success">MC</Badge>
                                            <Badge style={{ marginLeft: '8px'}} bg="success">Cosplayer</Badge>
                                            <Badge style={{ marginLeft: '8px'}} bg="success">Badut</Badge>
                                            <Badge style={{ marginLeft: '8px'}} bg="success">Pesulap</Badge>
                                    </span>
                                    <span className="text-muted">Post 3 mins ago</span>
                                </Row>
                                <span className="text-muted align-self-end"><a href="#" style={{ textDecoration: 'none', color: '#00A47F' }}>Detail</a></span>
                            </Col>
                        </Card.Footer>
                    </Card>
                    
                    <Card style={{ width: '72rem', marginTop: '32px' }}>
                        <Card.Body style={{ maxHeight: '512px' }}>
                            <Badge bg="success" style={{ position: 'absolute', top: '16px', right: '16px' }}>IDR: 100.000</Badge>
                            <Row className="mb-4">
                                <Col md={2} xl={1} className="d-flex justify-content-center align-items-center p-2">
                                    <Image variant="top" style={{ width: '65px', height: '65px' }} src="images/example-image.jpg" alt="Profile Image" roundedCircle />
                                </Col>
                                <Col className="d-block m-auto">
                                    <Card.Title>
                                        <a href="#" style={{ textDecoration: 'none', color: '#000000' }}>Band Musics</a>
                                    </Card.Title>
                                    <Card.Text>Jakarta</Card.Text>
                                </Col>
                            </Row>
                            <Card.Text style={{ paddingBottom: '8px' }}>
                                Need a band musician to play guitar and drums.
                                Need a band musician to play guitar and drums.
                                Need a band musician to play guitar and drums.
                                Need a band musician to play guitar and drums.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer style={{ backgroundColor: '#FFFFFF', padding: '8px'}}>
                            <Col className="d-flex justify-content-between">
                                <span>
                                    Entertainment Category:
                                        <Badge style={{ marginLeft: '8px'}} bg="success">MC</Badge>
                                        <Badge style={{ marginLeft: '8px'}} bg="success">Cosplayer</Badge>
                                        <Badge style={{ marginLeft: '8px'}} bg="success">Badut</Badge>
                                        <Badge style={{ marginLeft: '8px'}} bg="success">Pesulap</Badge>
                                </span>
                                <span className="text-muted align-self-end"><a href="#" style={{ textDecoration: 'none', color: '#00A47F' }}>Detail</a></span>
                            </Col>
                        </Card.Footer>
                    </Card>
                </Row>
            </Container>
            <FooterComponent />
        </div>
    );
};


export default VaTal;
