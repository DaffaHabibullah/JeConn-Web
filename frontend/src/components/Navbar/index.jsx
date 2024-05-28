import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { fetchUserProfile } from '../../api/User';

const NavbarComponent = () => {
    const [username, setUsername] = useState('');
    const [roles, setRoles] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchUserProfile();
                setUsername(response.data.username);
                setRoles(response.data.roles);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                throw error;
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <Navbar expand="lg" style={{ backgroundColor: '#00A47F' }}>
                <Container style={{ padding: '4px 16px', borderRadius: '5px' }}>
                    <Navbar.Brand href="/home">
                        <img className="d-inline-block align-top" src="/jeconn.png" alt="Logo Image" width="30" height="30" />
                        JeConn
                    </Navbar.Brand>
                    {/* <Nav style={{ marginLeft: 'auto', marginRight: '12px' }}>
                        <Nav.Link className="p-0" href="/messages">
                            <img className="d-inline-block align-top" src="/icon/message-icon.png" alt="Message Icon" width="30" height="30" />
                        </Nav.Link>
                    </Nav> */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <Nav.Link href="/home">Home</Nav.Link>
                            {roles.includes('talent') || (
                                <Nav.Link href="/join-talent">Become a Talent✨</Nav.Link>
                            )}
                            <Nav.Link href="/vacancies">Vacancies</Nav.Link>
                            <Nav.Link href="/talents">Talents</Nav.Link>
                            <Nav.Link href="/status">Status</Nav.Link>
                            <NavDropdown title={`Username: ${username}`}>
                                <NavDropdown.Item href="/user-profile">Profile</NavDropdown.Item>
                                {roles.includes('talent') && (
                                    <NavDropdown.Item href="/talent-profile">Talent Profile</NavDropdown.Item>
                                )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};


export default NavbarComponent;
