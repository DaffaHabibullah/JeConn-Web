import { Container, Row, Col } from 'react-bootstrap';

const FooterComponent = () => {
    return (
        <div style={{ marginTop: '64px', paddingTop: '64px', borderTop: '1px solid #00A47F' }}>
            <Container>
                <Row>
                    <Col className="text-center">
                        <img className="d-inline-block align-top" src="/jeconn.png" alt="Logo Image" width="30" height="30" />
                        <span className="d-flex align-items-center justify-content-center"><b>JECONN</b></span>
                    </Col>
                </Row>
                <hr />
                <Row className="mt-3">
                    <Col className="text-center">
                        <span>&copy; 2024 JECONN. All rights reserved.</span>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}


export default FooterComponent;
