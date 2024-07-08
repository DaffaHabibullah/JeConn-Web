import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Tabs, Tab } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import { fetchTalentProfile } from '../../api/Talent';
import { fetchSubmittedVacancies } from '../../api/Vacancies';
import { useNotification } from '../../components/Notification';

const Status = () => {
    const [talent, setTalent] = useState({});
    const [vacancies, setVacancies] = useState([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchTalent = async () => {
            try {
                const response = await fetchTalentProfile();
                setTalent(response.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        const fetchVacancies = async () => {
            try {
                const response = await fetchSubmittedVacancies();
                const sortedVacancies = response.data.sort((a, b) => {
                    const latestCandidateA = a.allCandidates.reduce((latest, candidate) => {
                        return new Date(candidate.timestamp) > new Date(latest.timestamp) ? candidate : latest;
                    });
                    const latestCandidateB = b.allCandidates.reduce((latest, candidate) => {
                        return new Date(candidate.timestamp) > new Date(latest.timestamp) ? candidate : latest;
                    });
                    return new Date(latestCandidateB.timestamp) - new Date(latestCandidateA.timestamp);
                });

                setVacancies(sortedVacancies);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        fetchTalent();
        fetchVacancies();
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

    const filterVacanciesByStatus = (status) => {
        return vacancies.filter(vacancy => 
            vacancy.allCandidates.some(candidate => candidate.status === status && candidate._id === talent._id)
        );
    };

    const renderVacancies = (filteredVacancies) => {
        if (filteredVacancies.length === 0) {
            return <Card.Title className="text-center mt-5">No data.</Card.Title>;
        }

        return filteredVacancies.map(vacancy => (
            <Card key={vacancy._id} style={{ marginTop: '24px', marginBottom: '16px' }}>
                <Row className="m-0 mb-2" style={{ maxHeight: '512px', position: 'relative', paddingTop: '16px', paddingLeft: '4px', paddingRight: '4px' }}>
                    <Col xs={9} md={10} xl={10} style={{ maxHeight: '7rem' }}>
                        <Card.Title style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            <a href={`/vacancies/post/${vacancy._id}`} 
                                style={{ 
                                    textDecoration: 'none', color: '#000000', overflow: 'hidden', textOverflow: 'ellipsis',
                                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'
                                }}>
                                {vacancy.title}
                            </a>
                        </Card.Title>
                        <Card.Text>{vacancy.location}</Card.Text>
                    </Col>
                </Row>
                <span className="text-center" style={{ position: 'absolute', right: '16px', top: '12px' }}>
                    <Badge bg={
                        vacancy.status ? 
                        (vacancy.typePost === "Event" ? "warning" : "success") :
                        "secondary"
                    }>
                        {vacancy.typePost}
                    </Badge>
                </span>
                <hr style={{ margin: '0px', backgroundColor: '#00A47F' }} />
                <Card.Body>
                    <Card.Text>
                        <h6 className="m-0"><b>Status:</b></h6>
                        {vacancy.allCandidates.map(candidate => (
                            candidate._id === talent._id && (
                                <Badge key={candidate._id} bg={
                                    candidate.status === 'approved' ? 'success' :
                                    candidate.status === 'pending' ? 'warning' :
                                    'danger'
                                }>
                                    {candidate.status === 'approved' ? 'Approved' :
                                    candidate.status === 'pending' ? 'Pending' :
                                    'Rejected'}
                                </Badge>
                            )
                        ))}
                    </Card.Text>

                    <Card.Text>
                        <h6 className="m-0"><b>Date:</b></h6>
                        <p>{vacancy.startDate} - {vacancy.endDate}</p>
                    </Card.Text>

                    <Card.Text>
                        <h6 className="m-0"><b>Description:</b></h6>
                        <p style={{
                            whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}>
                            {vacancy.description}
                        </p>
                    </Card.Text>
                </Card.Body>
                <Card.Footer style={{ backgroundColor: '#FFFFFF', paddingLeft: '16px', paddingRight: '16px' }}>
                    <Col className="d-flex justify-content-between">
                        <small className="text-muted">
                            {vacancy.allCandidates.map(candidate => (
                                candidate._id === talent._id && (
                                    <span key={candidate._id}>
                                        Submitted at: {getTimeAgo(candidate.timestamp).toLocaleString()}
                                    </span>
                                )
                            ))}
                        </small>
                        
                        <small className="text-muted">
                            <a href={`/vacancies/post/${vacancy._id}`} style={{ textDecoration: 'none', color: '#00A47F' }}>Detail ▸</a>
                        </small>
                    </Col>
                </Card.Footer>
            </Card>
        ));
    };

    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }} fluid>
                <Row xl={2} className="d-flex justify-content-center align-items-center">
                    <Card className="d-flex flex-column" style={{ padding: '16px', paddingBottom: '64px' }}>
                        <h2 style={{ marginBottom: '24px', borderBottom: '1px solid #00A47F' }}>Status</h2>
                        <Row>
                            <Tabs defaultActiveKey="all" className="p-2" style={{ marginTop: '16px', overflowX: 'auto', flexWrap: 'nowrap' }} fill>
                                <Tab eventKey="all" title={<span style={{ color: '#00A47F' }}>All</span>}>
                                    {renderVacancies(vacancies)}
                                </Tab>
                                <Tab eventKey="pending" title={<span style={{ color: '#FFC107' }}>Pending</span>}>
                                    {renderVacancies(filterVacanciesByStatus('pending'))}
                                </Tab>
                                <Tab eventKey="approved" title={<span style={{ color: '#00A47F' }}>Approved</span>}>
                                    {renderVacancies(filterVacanciesByStatus('approved'))}
                                </Tab>
                                <Tab eventKey="rejected" title={<span style={{ color: '#DC3545' }}>Rejected</span>}>
                                    {renderVacancies(filterVacanciesByStatus('rejected'))}
                                </Tab>
                            </Tabs>
                        </Row>
                    </Card>
                </Row>
            </Container>
        </div>
    );
};


export default Status;
