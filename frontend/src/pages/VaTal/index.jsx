import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Badge } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar";
import SearchbarComponent from "../../components/Searchbar";
import FooterComponent from "../../components/Footer";
import { fetchAllPostVacancies } from '../../api/Vacancies';

const VaTal = () => {
    const [content, setContent] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/vacancies")) {
            fetchAllPostVacancies().then((response) => {
                const sortedVacancies = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setContent(sortedVacancies);
            });
        } else if (location.pathname.includes("/talents")) {
            // fetchAllTalents().then((response) => {
            //     setContent(response.data);
            // });
        }
    }, [location]);

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
            <SearchbarComponent />
            <Container style={{ marginTop: '16px' }}>
                <Row className="d-flex justify-content-center align-items-center" style={{ paddingBottom: '64px' }}>
                    {location.pathname.includes("/vacancies")? (
                        content.map((item, index) => (
                            <Card key={index} style={{ width: '72rem', marginTop: '32px', marginBottom: '16px' }}>
                                <Card.Body style={{ maxHeight: '512px', position: 'relative', paddingTop: '8px', paddingLeft: '4px', paddingRight: '4px' }}>
                                    <Row className="mb-4">
                                        <Col xs={3} md={2} xl={1} className="d-flex justify-content-center align-items-center p-2" style={{ marginLeft: '4px' }}>
                                            <Image src={item.imageProfile} style={{ width: '72px', height: '72px' }} roundedCircle />
                                        </Col>
                                        <Col xs={12} md={7} xl={9} className="d-block p-3" style={{ maxHeight: '7rem' }}>
                                            <Card.Title><a href={`/vacancies/post/${item._id}`} style={{ textDecoration: 'none', color: '#000000' }}>{item.title}</a></Card.Title>
                                            <Card.Text>{item.location}</Card.Text>
                                        </Col>
                                    </Row>
                                    <span className="text-center" style={{ position: 'absolute', right: '8px', top: '16px' }}>
                                        <Badge bg={
                                            item.status ? 
                                            (item.typePost === "Event" ? "warning" : "success") :
                                            "secondary"
                                            }>
                                            {item.typePost}
                                        </Badge>
                                    </span>
                                    <span className="text-center" style={{ position: 'absolute', right: '8px', top: '48px' }}>
                                        {item.candidates} Candidates <img src="/icon/people.png" style={{ marginLeft: '2px' }} />
                                    </span>
                                    
                                    <span className="d-flex align-items-center justify-content-end" style={{ position: 'absolute', right: '8px', top: '80px' }}>
                                        {item.startDate} | {item.endDate}
                                        <img src="/icon/date.png" style={{ marginLeft: '8px' }} />
                                    </span>
                                    <Card.Text style={{ paddingTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                                        {item.description}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: '8px', paddingRight: '8px' }}>
                                    <Col className="d-flex justify-content-between">
                                        <small className="text-muted">{getTimeAgo(item.createdAt).toLocaleString()}</small>
                                        <small className="text-muted"><a href={`/vacancies/post/${item._id}`} style={{ textDecoration: 'none', color: '#00A47F' }}>Detail ▸</a></small>
                                    </Col>
                                </Card.Footer>
                            </Card>
                        ))
                    ) : (
                        content.map((item, index) => (
                            <Col key={index} xs={12} md={6} lg={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>
                                            <Badge bg="secondary">{item.type}</Badge>
                                        </Card.Text>
                                        <Card.Text>
                                            <small className="text-muted">{item.address}</small>
                                        </Card.Text>
                                        <Card.Text>
                                            <small className="text-muted">Posted {getTimeAgo(item.createdAt)}</small>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}

                {content.length === 0 && (
                    <Col>
                        <h2 className="text-center" style={{ marginTop: '16px' }}>Loading ...</h2>
                    </Col>
                )}
                </Row>
            </Container>
            <FooterComponent />
        </div>
    );
};


export default VaTal;
