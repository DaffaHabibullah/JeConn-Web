import { useNavigate } from 'react-router-dom';
import { Container, Row, Navbar, Nav, Button } from 'react-bootstrap';
import { useNotification } from '../Notification';

const SidebarComponent = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        showNotification('Logout success');
    };

    return (
        <div>
            <Container style={{ paddingTop: '24px' }}>
                <Navbar.Brand href="/admin" className="d-flex justify-content-center align-items-center" style={{ marginBottom: '32px' }}>
                    <img className="d-inline-block align-top" src="/jeconn.png" alt="Logo Image" width="50" height="50" />{' '}
                    <span style={{ fontSize: '32px', fontWeight: 'bold' }}>JECONN</span>
                </Navbar.Brand>
                <hr />
                <p className="text-center" style={{ paddingBottom: '80px', color: '#00A47F', fontSize: '24px', fontWeight: 'bold' }}>Admin Access</p>
                <Nav defaultActiveKey="/admin/dashboard" className="flex-column gap-1" style={{ fontSize: '20px' }}>
                    <Row>
                        <Nav.Link href="/admin/dashboard" style={{ padding: '16px', color: '#000000', borderTop: '1px solid' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fa-solid fa-chart-line"></i> Dashboard
                                </span>
                                <i className="fa-solid fa-caret-right"></i>
                            </div>
                        </Nav.Link>

                        <Nav.Link href="/admin/user" style={{ padding: '16px', color: '#000000', borderTop: '1px solid' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fa-solid fa-user-group"></i> User
                                </span>
                                <i className="fa-solid fa-caret-right"></i>
                            </div>
                        </Nav.Link>

                        <Nav.Link href="/admin/talent" style={{ padding: '16px', color: '#000000', borderTop: '1px solid' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fa-solid fa-user-tie"></i> Talent
                                </span>
                                <i className="fa-solid fa-caret-right"></i>
                            </div>
                        </Nav.Link>

                        <Nav.Link href="/admin/vacancies" style={{ padding: '16px', color: '#000000', borderTop: '1px solid' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fa-solid fa-briefcase"></i> Vacancies
                                </span>
                                <i className="fa-solid fa-caret-right"></i>
                            </div>
                        </Nav.Link>

                        <Nav.Link href="/admin/entertainment" style={{ padding: '16px', color: '#000000', borderTop: '1px solid' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fa-solid fa-icons"></i> Entertainment
                                </span>
                                <i className="fa-solid fa-caret-right"></i>
                            </div>
                        </Nav.Link>

                        <Nav.Link href="/admin/locations" style={{ padding: '16px', color: '#000000', borderTop: '1px solid', borderBottom: '1px solid' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="fa-solid fa-location-dot"></i> Locations
                                </span>
                                <i className="fa-solid fa-caret-right"></i>
                            </div>
                        </Nav.Link>
                    </Row>
                </Nav>

                <div className="text-center" style={{ marginTop: '96px', marginBottom: '80px' }}>
                    <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                </div>
            </Container>
        </div>
    );
};


export default SidebarComponent;
