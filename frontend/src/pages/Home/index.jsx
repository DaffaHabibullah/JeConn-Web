import { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Card, ListGroup, Badge } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import FooterComponent from '../../components/Footer';
import { fetchAllPostVacancies } from '../../api/Vacancies';
import { fetchAllTalent } from '../../api/Talent';

const Home = () => {
    const [vacancies, setVacancies] = useState([]);
    const [talent, setTalent] = useState([]);

    useEffect(() => {
        const fetchVacanciesAndTalent = async () => {
            try {
                const responseVacancies = await fetchAllPostVacancies();
                const responseTalent = await fetchAllTalent();
                
                const sortedVacancies = responseVacancies.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const openTalent = responseTalent.data
                    .filter(talent => talent.isOpen)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setVacancies(sortedVacancies);
                setTalent(openTalent);
            } catch (error) {
                console.error('Failed to fetch vacancies and talent:', error);
            }
        };

        fetchVacanciesAndTalent();
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
                            <h3><b>New Talents Available</b></h3>
                            <Button variant="success" className="me-2 mb-2" href="/talents">See All</Button>
                        </div>
                        
                        {talent.map((talent, index) => (
                            <Card key={index} style={{ maxWidth: '16rem', marginRight: "32px", marginBottom: "32px", paddingTop: "16px" }}>
                                <Card.Img variant="top" style={{ height: '200px', objectFit: 'cover' }} src={talent.imageProfile} alt="Profile Image" />
                                <Card.Body style={{ position: 'relative', paddingLeft: '8px', paddingRight: '8px' }}>
                                    <Card.Title><a href={`/talent/profile/${talent.username}`} style={{ textDecoration: 'none', color: '#000000' }}>{talent.username}</a></Card.Title>
                                    <Card.Text style={{ paddingTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {talent.biography}
                                    </Card.Text>
                                </Card.Body>
                                <Badge bg="success" style={{ position: 'absolute', top: '16px', right: '12px' }}>{talent.location}</Badge>
                                <Card.Footer style={{ minHeight: '75px', paddingLeft: '8px', paddingRight: '8px', backgroundColor: '#FFFFFF'}}>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item className="p-0" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            <h6>
                                                {talent.entertainment_id.map(entertainment => (
                                                    <Badge key={entertainment} bg="success" className="me-2 mb-2">{entertainment}</Badge>
                                                ))}
                                            </h6>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Footer>
                            </Card>
                        ))}

                        {talent.length === 0 && (
                            <Col>
                                <h5 className="m-5 text-center">Loading ...</h5>
                            </Col>
                        )}
                    </Row>
                </Container>
            </Container>
            <FooterComponent />
        </div>
    );
};


export default Home;
