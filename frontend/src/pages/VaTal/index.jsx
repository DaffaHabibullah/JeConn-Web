import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Image, ListGroup, Badge } from "react-bootstrap";
import NavbarComponent from "../../components/Navbar";
import SearchbarComponent from "../../components/Searchbar";
import FooterComponent from "../../components/Footer";
import { fetchAllPostVacancies } from '../../api/Vacancies';
import { fetchAllTalent } from '../../api/Talent';

const VaTal = () => {
    const [content, setContent] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/vacancies")) {
            fetchAllPostVacancies().then((response) => {
                const sortedVacancies = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setContent(sortedVacancies);
                setFilteredContent(sortedVacancies);
            });
        } else if (location.pathname.includes("/talents")) {
            fetchAllTalent().then((response) => {
                const openTalent = response.data.filter((item) => item.isOpen);
                const closedTalent = response.data.filter((item) => !item.isOpen);
                
                const sortedTalent = openTalent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const sortedClosedTalent = closedTalent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                const sortedTalentAndClosedTalent = [...sortedTalent, ...sortedClosedTalent];
                setContent(sortedTalentAndClosedTalent);
                setFilteredContent(sortedTalentAndClosedTalent);
            });
        }
    }, [location]);

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        const filtered = content.filter((item) => {
            const title = item.title?.toLowerCase() || "";
            const username = item.username?.toLowerCase() || "";
            const location = item.location?.toLowerCase() || "";
            const categories = item.entertainment_id?.map(id => id.toLowerCase()) || [];

            return title.includes(query) || username.includes(query) || location.includes(query) || categories.some(category => category.includes(query));
        });
        setFilteredContent(filtered);
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

    return (
        <div>
            <NavbarComponent />
            <SearchbarComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
            <Container style={{ marginTop: '16px' }}>
                <Row className="d-flex justify-content-center align-items-center" style={{ paddingBottom: '64px' }}>
                    {location.pathname.includes("/vacancies")? (
                        filteredContent.map((item, index) => (
                            <Card key={index} style={{ width: '72rem', marginTop: '32px', marginBottom: '8px' }}>
                                <Card.Body style={{ maxHeight: '512px', position: 'relative', paddingTop: '8px', paddingLeft: '4px', paddingRight: '4px' }}>
                                    <Row className="m-0 mb-4">
                                        <Col xs={4} md={2} xl={1} className="d-flex justify-content-start align-items-center p-2">
                                            <Image src={item.imageProfile} style={{ width: '72px', height: '72px', objectFit: 'cover' }} roundedCircle />
                                        </Col>
                                        <Col xs={12} md={7} xl={9} className="d-block p-0 pt-3" style={{ maxHeight: '7rem' }}>
                                            <Card.Title><a href={`/vacancies/post/${item._id}`} style={{ textDecoration: 'none', color: '#000000', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</a></Card.Title>
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
                                        {item.candidates} Candidates <img src="/icon/people-icon.png" style={{ marginLeft: '2px' }} />
                                    </span>
                                    
                                    <span className="d-flex align-items-center justify-content-end" style={{ position: 'absolute', right: '8px', top: '76px' }}>
                                        {item.startDate} | {item.endDate}
                                        <img src="/icon/date-icon.png" style={{ marginLeft: '8px' }} />
                                    </span>
                                    <Card.Text style={{ paddingTop: '4px', whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
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
                        filteredContent.map((item, index) => (
                            <Card key={index} style={{ width: '72rem', marginTop: '32px', marginBottom: '8px' }}>
                                <Card.Body style={{ maxHeight: '512px', position: 'relative', paddingTop: '24px', paddingLeft: '4px', paddingRight: '4px' }}>
                                    <Row className="me-0">
                                        <Col xs={12} md={3} xl={2} className="d-block pb-3">
                                            <Image src={item.imageProfile} alt="Profile Image" className="d-block mx-auto" style={{ height: '144px', width: '144px', objectFit: 'cover' }} rounded />
                                            <Col className="text-center" style={{ marginTop: '8px' }}>
                                                <span>
                                                    <img src="/icon/location-icon.png" style={{ marginRight: '2px' }} />
                                                    {item.location}
                                                </span>
                                            </Col>

                                            <Col className="text-center" style={{ marginTop: '14px' }}>
                                                <span style={{
                                                    backgroundColor: item.isOpen ? '#FFC107' : '#6C757D',
                                                    color: item.isOpen ? 'inherit' : '#FFFFFF',
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px',
                                                }}>
                                                    {item.isOpen ? "Open" : "Closed"}
                                                </span>
                                            </Col>
                                        </Col>

                                        <Col xs={12} md={9} xl={10} className="d-flex flex-column">
                                            <Card.Title><a href={`/talent/profile/${item.username}`} style={{ textDecoration: 'none', color: '#000000', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.username}</a></Card.Title>
                                            <Card.Text style={{ paddingTop: '8px', whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                {item.biography}
                                            </Card.Text>
                                            <ListGroup className="list-group-flush mt-auto pt-2">
                                                <span className="mb-1">Entertainment Category :</span>
                                                <ListGroup.Item className="p-0" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                    <h6>
                                                        {item.entertainment_id.map(entertainment => (
                                                            <Badge key={entertainment} bg="success" className="me-2 mb-2">{entertainment}</Badge>
                                                        ))}
                                                    </h6>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: '8px', paddingRight: '8px' }}>
                                    <Col className="d-flex justify-content-between">
                                        <small className="text-muted">Talent since: {getTimeAgo(item.createdAt).toLocaleString()}</small>
                                        <small className="text-muted"><a href={`/talent/profile/${item.username}`} style={{ textDecoration: 'none', color: '#00A47F' }}>Detail ▸</a></small>
                                    </Col>
                                </Card.Footer>
                            </Card>
                        ))
                    )}

                {filteredContent.length === 0 && (
                    <Col>
                        <h5 className="text-center" style={{ marginTop: '16px' }}>No results found.</h5>
                    </Col>
                )}
                </Row>
            </Container>
            <FooterComponent />
        </div>
    );
};


export default VaTal;
