import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const SearchbarComponent = () => {
    const location = useLocation();

    const handlePlaceholderText = () => {
        if (location.pathname.includes('vacancies')) {
            return 'Search vacancies...';
        } else if (location.pathname.includes('talents')) {
            return 'Search talents...';
        } else {
            return 'Search...';
        }
    };

    return (
        <div>
            <Container style={{ paddingTop: '32px', paddingBottom: '8px', borderBottom: '1px solid #00A47F' }}>
                <Row className="d-flex justify-content-center">
                    <Col md={12} className="d-flex justify-content-center" style={{ padding: '16px' }}>
                        <Form.Control type="text" placeholder={handlePlaceholderText()} />
                        <Button style={{ marginLeft: '16px' }} type="submit" variant="outline-success">Search</Button>
                    </Col>
                </Row>
                <h5 style={{ marginTop: '48px' }}>All {location.pathname.includes("vacancies") ? "Vacancies" : "Talents"}:</h5>
            </Container>
        </div>
    );
};


export default SearchbarComponent;
