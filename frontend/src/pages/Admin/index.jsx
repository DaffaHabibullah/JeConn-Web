import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Table, Pagination, Form, Image, Button, Modal } from 'react-bootstrap';
import SidebarComponent from '../../components/Sidebar';
import FooterComponent from '../../components/Footer';
import { fetchAllUsers, fetchBanUser, fetchUnbanUser } from '../../api/User';
import { fetchAllTalents } from '../../api/Talent';
import { fetchAllPostVacancies, fetchDeleteVacancies } from '../../api/Vacancies';
import { fetchAddEntertainmentCategories, fetchEntertainmentCategories, fetchUpdateEntertainmentCategories, fetchDeleteEntertainmentCategories } from '../../api/EntertainmentCategories';
import { fetchAddLocations, fetchLocations, fetchUpdateLocations, fetchDeleteLocations } from '../../api/Locations';
import { useNotification } from '../../components/Notification';
import NotFound from '../NotFound';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [talents, setTalents] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [entertainments, setEntertainments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchData, setSearchData] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalBan, setShowModalBan] = useState(false);
    const [showModalUnban, setShowModalUnban] = useState(false);
    const [showModalAddData, setShowModalAddData] = useState(false);
    const [showModalUpdateData, setShowModalUpdateData] = useState(false);
    const [showModalDeleteData, setShowModalDeleteData] = useState(false);
    const [addData, setAddData] = useState({ name: '' });
    const [updateData, setUpdateData] = useState({ name: '' });
    const [selectedData, setSelectedData] = useState({ id: '', name: '' });
    const location = useLocation();
    const { showNotification } = useNotification();
    const token = localStorage.getItem('token');

    const itemsPerPage = 10;

    const filterData = (data) => {
        return data.filter(item =>
            item._id?.toLowerCase().includes(searchData.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchData.toLowerCase()) ||
            item.username?.toLowerCase().includes(searchData.toLowerCase()) ||
            item.name?.toLowerCase().includes(searchData.toLowerCase())
        );
    };

    const filteredUsers = filterData(users);
    const filteredTalents = filterData(talents);
    const filteredVacancies = filterData(vacancies);
    const filteredEntertainments = filterData(entertainments);
    const filteredLocations = filterData(locations);

    const totalFilteredUsersPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const totalFilteredTalentsPages = Math.ceil(filteredTalents.length / itemsPerPage);
    const totalFilteredVacanciesPages = Math.ceil(filteredVacancies.length / itemsPerPage);
    const totalFilteredEntertainmentsPages = Math.ceil(filteredEntertainments.length / itemsPerPage);
    const totalFilteredLocationsPages = Math.ceil(filteredLocations.length / itemsPerPage);

    const paginate = (items, pageNumber) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchData]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseUsers = await fetchAllUsers();
                setUsers(responseUsers.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        const fetchTalents = async () => {
            try {
                const responseTalents = await fetchAllTalents();
                setTalents(responseTalents.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        const fetchAllVacancies = async () => {
            try {
                const responseVacancies = await fetchAllPostVacancies();
                setVacancies(responseVacancies.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        const fetchAllEntertainment = async () => {
            try {
                const responseEntertainment = await fetchEntertainmentCategories();
                setEntertainments(responseEntertainment.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        const fetchAllLocations = async () => {
            try {
                const responseLocations = await fetchLocations();
                setLocations(responseLocations.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        if (token) {
            fetchUsers();
            fetchTalents();
            fetchAllVacancies();
            fetchAllEntertainment();
            fetchAllLocations();
        }
    }, [token]);

    const handleBanUser = async () => {
        try {
            const response = await fetchBanUser(selectedData.id);
            showNotification(response.message);
            setShowModalBan(false);

            const responseUsers = await fetchAllUsers();
            setUsers(responseUsers.data);
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleUnbanUser = async () => {
        try {
            const response = await fetchUnbanUser(selectedData.id);
            showNotification(response.message);
            setShowModalUnban(false);

            const responseUsers = await fetchAllUsers();
            setUsers(responseUsers.data);
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleupdateData = async () => {
        try {
            if (location.pathname.includes('entertainment')) {
                const response = await fetchAddEntertainmentCategories(addData);
                showNotification(response.message);

                const responseEntertainment = await fetchEntertainmentCategories();
                setEntertainments(responseEntertainment.data);
            } else if (location.pathname.includes('location')) {
                const response = await fetchAddLocations(addData.name);
                showNotification(response.message);

                const responseLocations = await fetchLocations();
                setLocations(responseLocations.data);
            }

            setShowModalAddData(false);
            setAddData({ name: '' });
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleUpdateData = async () => {
        try {
            if (location.pathname.includes('entertainment')) {
                const response = await fetchUpdateEntertainmentCategories(selectedData.id, updateData.name);
                showNotification(response.message);

                const responseEntertainment = await fetchEntertainmentCategories();
                setEntertainments(responseEntertainment.data);
            } else if (location.pathname.includes('location')) {
                const response = await fetchUpdateLocations(selectedData.id, updateData.name);
                showNotification(response.message);

                const responseLocations = await fetchLocations();
                setLocations(responseLocations.data);
            }

            setShowModalUpdateData(false);
            setUpdateData({ name: '' });
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleDeleteData = async () => {
        try {
            if (location.pathname.includes('vacancies')) {
                const response = await fetchDeleteVacancies(selectedData.id);
                showNotification(response.message);

                const responseVacancies = await fetchAllPostVacancies();
                setVacancies(responseVacancies.data);
            } else if (location.pathname.includes('entertainment')) {
                const response = await fetchDeleteEntertainmentCategories(selectedData.id);
                showNotification(response.message);

                const responseEntertainment = await fetchEntertainmentCategories();
                setEntertainments(responseEntertainment.data);
            } else if (location.pathname.includes('location')) {
                const response = await fetchDeleteLocations(selectedData.id);
                showNotification(response.message);

                const responseLocations = await fetchLocations();
                setLocations(responseLocations.data);
            }

            setShowModalDeleteData(false);
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    return (
        <div>
            <Container style={{ border: '1px solid #00A47F' }}>
                <Row>
                    <Col md="4" lg="3" style={{ paddingTop: '32px', borderRight: '1px solid #00A47F' }}>
                        <SidebarComponent />
                    </Col>
                    <Col md="8" lg="9" style={{ paddingTop: '32px', paddingLeft: '20px' }}>
                        {location.pathname === "/admin" || location.pathname.includes("/admin/dashboard") ? (
                            <div>
                                <h1 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>Dashboard Admin</h1>
                                <Row className="m-0">
                                    <Col className="p-0 d-flex justify-content-center align-items-center">
                                        <Image style={{ width: '384px', height: 'auto', marginBottom: '32px' }} src="/images/admin-image.jpg" alt="Admin Image" />
                                    </Col>
                                    <Col className="p-0">
                                        <h3 style={{ marginBottom: '24px', fontWeight: 'bold' }}>Statistics:</h3>
                                        <Col md="12" lg="12" style={{ marginBottom: '32px', padding: '8px', border: '2px solid #00A47F', borderRadius: '5px' }}>
                                            <h4 style={{ borderBottom: '1px solid #00A47F', fontWeight: 'bold' }}>Total Users:</h4>
                                            <p style={{ fontSize: '18px' }}>{users.length} <span style={{ color: '#00A47F', fontWeight: 'bold' }}>Users</span></p>
                                            <small className="text-muted"><a href="/admin/user" style={{ textDecoration: 'none', color: '#00A47F' }}>See more ▸</a></small>
                                        </Col>
                                        <Col md="12" lg="12" style={{ marginBottom: '32px', padding: '8px', border: '2px solid #00A47F', borderRadius: '5px' }}>
                                            <h4 style={{ borderBottom: '1px solid #00A47F', fontWeight: 'bold' }}>Total Talents:</h4>
                                            <p style={{ fontSize: '18px' }}>{talents.length} <span style={{ color: '#FFC107', fontWeight: 'bold' }}>Talents</span></p>
                                            <small className="text-muted"><a href="/admin/talent" style={{ textDecoration: 'none', color: '#00A47F' }}>See more ▸</a></small>
                                        </Col>
                                        <Col md="12" lg="12" style={{ marginBottom: '32px', padding: '8px', border: '2px solid #00A47F', borderRadius: '5px' }}>
                                            <h4 style={{ borderBottom: '1px solid #00A47F', fontWeight: 'bold' }}>Total Vacancies:</h4>
                                            <p style={{ fontSize: '18px' }}>{vacancies.length} <span style={{ color: '#6C757D', fontWeight: 'bold' }}>Post Vacancies</span></p>
                                            <small className="text-muted"><a href="/admin/vacancies" style={{ textDecoration: 'none', color: '#00A47F' }}>See more ▸</a></small>
                                        </Col>
                                    </Col>
                                    <Row className="m-0 p-0 d-flex justify-content-end align-items-end">
                                        <Col md="12" lg="5" style={{ marginBottom: '32px', padding: '8px', border: '2px solid #00A47F', borderRadius: '5px' }}>
                                            <h4 style={{ borderBottom: '1px solid #00A47F', fontWeight: 'bold' }}>Total Entertainment:</h4>
                                            <p style={{ fontSize: '18px' }}>{entertainments.length} <span style={{ color: '#6C757D', fontWeight: 'bold' }}>Categories</span></p>
                                            <small className="text-muted"><a href="/admin/entertainment" style={{ textDecoration: 'none', color: '#00A47F' }}>See more ▸</a></small>
                                        </Col>
                                        <Col md="12" lg="6" style={{ marginBottom: '32px', marginLeft: '16px', padding: '8px', border: '2px solid #00A47F', borderRadius: '5px' }}>
                                            <h4 style={{ borderBottom: '1px solid #00A47F', fontWeight: 'bold' }}>Total Locations:</h4>
                                            <p style={{ fontSize: '18px' }}>{locations.length} <span style={{ color: '#6C757D', fontWeight: 'bold' }}>Locations</span></p>
                                            <small className="text-muted"><a href="/admin/locations" style={{ textDecoration: 'none', color: '#00A47F' }}>See more ▸</a></small>
                                        </Col>
                                    </Row>
                                </Row>
                            </div>
                        ) : location.pathname.includes("/admin/user") ? (
                            <div>
                                <h1 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>User Data</h1>
                                <Row>
                                    <Col className="mb-3 d-flex align-items-center">
                                        <p className="m-0">Total Users: <span>{users.length}</span> recorded</p>
                                    </Col>

                                    <Col className="mb-3 d-flex justify-content-end align-items-center">
                                        <p className="m-0 me-2">Search user</p>
                                        <Form.Control type="text" placeholder="ID, Email, or Username" style={{ width: '192px' }} value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                                    </Col>

                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>_id</th>
                                                    <th>Email</th>
                                                    <th>Username</th>
                                                    <th>Image</th>
                                                    <th>Role</th>
                                                    <th>Full Name</th>
                                                    <th>Gender</th>
                                                    <th>Date of Birth</th>
                                                    <th>Address</th>
                                                    <th>Phone Number</th>
                                                    <th>Vacancies Post ID</th>
                                                    <th>Status Active</th>
                                                    <th>Create Since</th>
                                                    <th>Last Update</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginate(filteredUsers, currentPage).map((user, index) => (
                                                    <tr key={user._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{user._id}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.username}</td>
                                                        <td>
                                                            <img
                                                                src={user.imageProfile}
                                                                alt={user.imageProfile}
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10%', backgroundColor: 'transparent' }}
                                                            />
                                                        </td>
                                                        <td>{user.roles.join(', ')}</td>
                                                        <td>{user.fullName || '*Null*'}</td>
                                                        <td>{user.gender || '*Null*'}</td>
                                                        <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                                                        <td>{user.address || '*Null*'}</td>
                                                        <td>{user.phoneNumber || '*Null*'}</td>
                                                        <td>{user.vacanciesId.join(', ') || '*Null*'}</td>
                                                        <td>{user.status ? 'Active' : 'Banned'}</td>
                                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                        <td>{new Date(user.updatedAt).toLocaleDateString() || '*Null*'}</td>
                                                        <td>
                                                            {user.status ? (
                                                                <Button variant="danger" size="sm" onClick={() => { setSelectedData({ id: user._id }); setShowModalBan(true); }}>🚫BAN</Button>
                                                            ) : (
                                                                <Button variant="success" size="sm" onClick={() => { setSelectedData({ id: user._id }); setShowModalUnban(true); }}>✅UNBAN</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </Table>
                                    </Col>

                                    <Col>
                                        <Pagination className="pt-2 justify-content-end" size="sm">
                                            {Array.from({ length: totalFilteredUsersPages }, (_, index) => (
                                                <Pagination.Item
                                                    key={index + 1}
                                                    active={index + 1 === currentPage}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}
                                        </Pagination>
                                    </Col>
                                </Row>
                            </div>
                        ) : location.pathname.includes("/admin/talent") ? (
                            <div>
                                <h1 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>Talent Data</h1>
                                <Row>
                                    <Col className="mb-3 d-flex align-items-center">
                                        <p className="m-0">Total Talents: <span>{talents.length}</span> recorded</p>
                                    </Col>

                                    <Col className="mb-3 d-flex justify-content-end align-items-center">
                                        <p className="m-0 me-2">Search talent</p>
                                        <Form.Control type="text" placeholder="ID or Username" style={{ width: '192px' }} value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                                    </Col>

                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>_id</th>
                                                    <th>Username</th>
                                                    <th>NIK KTP</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Province</th>
                                                    <th>Address</th>
                                                    <th>Postal Code</th>
                                                    <th>Biography</th>
                                                    <th>Current Location</th>
                                                    <th>Entertainment ID</th>
                                                    <th>Images Post</th>
                                                    <th>Status</th>
                                                    <th>Create Since</th>
                                                    <th>Last Update</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginate(filteredTalents, currentPage).map((talent, index) => (
                                                    <tr key={talent._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{talent._id}</td>
                                                        <td>{talent.username}</td>
                                                        <td>{talent.nikKTP}</td>
                                                        <td>{talent.firstName}</td>
                                                        <td>{talent.lastName}</td>
                                                        <td>{talent.province}</td>
                                                        <td>{talent.address}</td>
                                                        <td>{talent.postalCode}</td>
                                                        <td>{talent.biography || '*Null*'}</td>
                                                        <td>{talent.location || '*Null*'}</td>
                                                        <td>{talent.entertainment_id.join(', ') || '*Null*'}</td>
                                                        <td>
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gap: '5px', backgroundColor: 'transparent' }}>
                                                                {talent.images.length > 0 ? (
                                                                    talent.images.map((image, imgIndex) => (
                                                                        <img
                                                                            key={imgIndex}
                                                                            src={image}
                                                                            alt={`Image ${imgIndex + 1}`}
                                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10%' }}
                                                                        />
                                                                    ))
                                                                ) : (
                                                                    'Null'
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>{talent.isOpen ? 'Open' : 'Close'}</td>
                                                        <td>{new Date(talent.createdAt).toLocaleDateString()}</td>
                                                        <td>{new Date(talent.updatedAt).toLocaleDateString() || '*Null*'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>

                                    <Col>
                                        <Pagination className="pt-2 justify-content-end" size="sm">
                                            {Array.from({ length: totalFilteredTalentsPages }, (_, index) => (
                                                <Pagination.Item
                                                    key={index + 1}
                                                    active={index + 1 === currentPage}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}
                                        </Pagination>
                                    </Col>
                                </Row>
                            </div>
                        ) : location.pathname.includes("/admin/vacancies") ? (
                            <div>
                                <h1 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>Vacancies Data</h1>
                                <Row>
                                    <Col className="mb-3 d-flex align-items-center">
                                        <p className="m-0">Total Post: <span>{vacancies.length}</span> recorded</p>
                                    </Col>

                                    <Col className="mb-3 d-flex justify-content-end align-items-center">
                                        <p className="m-0 me-2">Search vacancy</p>
                                        <Form.Control type="text" placeholder="ID or Username" style={{ width: '192px' }} value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                                    </Col>

                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>_id</th>
                                                    <th>Username</th>
                                                    <th>Type Post</th>
                                                    <th>Title</th>
                                                    <th>Location</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Address</th>
                                                    <th>Description</th>
                                                    <th>Candidates</th>
                                                    <th>Salary</th>
                                                    <th>Type Salary</th>
                                                    <th>Entertainment ID</th>
                                                    <th>Status</th>
                                                    <th>All Candidates</th>
                                                    <th>Create Since</th>
                                                    <th>Last Update</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginate(filteredVacancies, currentPage).map((vacancy, index) => (
                                                    <tr key={vacancy._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{vacancy._id}</td>
                                                        <td>{vacancy.username}</td>
                                                        <td>{vacancy.typePost}</td>
                                                        <td>{vacancy.title}</td>
                                                        <td>{vacancy.location}</td>
                                                        <td>{new Date(vacancy.startDate).toLocaleDateString()}</td>
                                                        <td>{new Date(vacancy.endDate).toLocaleDateString()}</td>
                                                        <td>{vacancy.address}</td>
                                                        <td>{vacancy.description}</td>
                                                        <td>{vacancy.candidates}</td>
                                                        <td>IDR. {vacancy.salary}</td>
                                                        <td>{vacancy.typeSalary}</td>
                                                        <td>{vacancy.entertainment_id.join(', ')}</td>
                                                        <td>{vacancy.status ? 'Open' : 'Close'}</td>
                                                        <td>{vacancy.allCandidates.map(candidate => candidate.username).join(', ') || '*Null*'}</td>
                                                        <td>{new Date(vacancy.createdAt).toLocaleDateString()}</td>
                                                        <td>{new Date(vacancy.updatedAt).toLocaleDateString() || '*Null*'}</td>
                                                        <td>
                                                            <Button variant="danger" size="sm" onClick={() => {
                                                                setSelectedData({ id: vacancy._id });
                                                                setShowModalDeleteData(true);
                                                            }}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>

                                    <Col>
                                        <Pagination className="pt-2 justify-content-end" size="sm">
                                            {Array.from({ length: totalFilteredVacanciesPages }, (_, index) => (
                                                <Pagination.Item
                                                    key={index + 1}
                                                    active={index + 1 === currentPage}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}
                                        </Pagination>
                                    </Col>
                                </Row>
                            </div>
                        ) : location.pathname.includes("/admin/entertainment") ? (
                            <div>
                                <h1 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>Entertainment Data</h1>
                                <Row>
                                    <Col className="mb-3 d-flex align-items-center">
                                        <p className="m-0">Total Categories: <span>{entertainments.length}</span> recorded</p>
                                    </Col>

                                    <Col className="mb-3 d-flex justify-content-end align-items-center">
                                        <p className="m-0 me-2">Search category</p>
                                        <Form.Control type="text" placeholder="ID or Name" style={{ width: '192px' }} value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                                        <Button className="ms-3" variant="success" onClick={() => setShowModalAddData(true)}>+ Add</Button>
                                    </Col>

                                    <Col lg="12">
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>_id</th>
                                                    <th>Name</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginate(filteredEntertainments.sort((a, b) => a._id - b._id), currentPage).map((entertainment) => (
                                                    <tr key={entertainment._id}>
                                                        <td>{entertainment._id}</td>
                                                        <td>{entertainment.name}</td>
                                                        <td>
                                                            <Button className="me-2" variant="warning" size="sm" onClick={() => {
                                                                setSelectedData({ id: entertainment._id, name: entertainment.name });
                                                                setShowModalUpdateData(true);
                                                            }}>Update</Button>
                                                            <Button variant="danger" size="sm" onClick={() => {
                                                                setSelectedData({ id: entertainment._id });
                                                                setShowModalDeleteData(true);
                                                            }}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>

                                    <Col>
                                        <Pagination className="pt-2 justify-content-end" size="sm">
                                            {Array.from({ length: totalFilteredEntertainmentsPages }, (_, index) => (
                                                <Pagination.Item
                                                    key={index + 1}
                                                    active={index + 1 === currentPage}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}
                                        </Pagination>
                                    </Col>
                                </Row>
                            </div>
                        ) : location.pathname.includes("/admin/locations") ? (
                            <div>
                                <h1 style={{ marginBottom: '48px', borderBottom: '1px solid #00A47F' }}>Location Data</h1>
                                <Row>
                                    <Col className="mb-3 d-flex align-items-center">
                                        <p className="m-0">Total Locations: <span>{locations.length}</span> recorded</p>
                                    </Col>

                                    <Col className="mb-3 d-flex justify-content-end align-items-center">
                                        <p className="m-0 me-2">Search location</p>
                                        <Form.Control type="text" placeholder="ID or Name" style={{ width: '192px' }} value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                                        <Button className="ms-3" variant="success" onClick={() => setShowModalAddData(true)}>+ Add</Button>
                                    </Col>

                                    <Col lg="12">
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>_id</th>
                                                    <th>Name</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginate(filteredLocations.sort((a, b) => a._id - b._id), currentPage).map((location) => (
                                                    <tr key={location._id}>
                                                        <td>{location._id}</td>
                                                        <td>{location.name}</td>
                                                        <td>
                                                            <Button className="me-2" variant="warning" size="sm" onClick={() => {
                                                                setSelectedData({ id: location._id, name: location.name });
                                                                setShowModalUpdateData(true);
                                                            }}>Update</Button>
                                                            <Button variant="danger" size="sm" onClick={() => {
                                                                setSelectedData({ id: location._id });
                                                                setShowModalDeleteData(true);
                                                            }}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Col>

                                    <Col>
                                        <Pagination className="pt-2 justify-content-end" size="sm">
                                            {Array.from({ length: totalFilteredLocationsPages }, (_, index) => (
                                                <Pagination.Item
                                                    key={index + 1}
                                                    active={index + 1 === currentPage}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}
                                        </Pagination>
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                            <NotFound />
                        )}
                    </Col>
                </Row>
            </Container>

            <Modal show={showModalBan} onHide={() => setShowModalBan(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ban User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to ban this user?</p>
                    <p className="m-0">User ID: <span style={{ fontWeight: 'bold' }}>{selectedData.id}</span></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalBan(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleBanUser}>Ban User</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalUnban} onHide={() => setShowModalUnban(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Unban User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to unban this user?</p>
                    <p className="m-0">User ID: <span style={{ fontWeight: 'bold' }}>{selectedData.id}</span></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalUnban(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleUnbanUser}>Unban User</Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" show={showModalAddData} onHide={() => setShowModalAddData(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{location.pathname.includes('entertainment') ? 'Add Entertainment Category' : 'Add Location'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                id="name"
                                type="text"
                                value={addData.name}
                                onChange={(e) => setAddData({ ...addData, name: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalAddData(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleupdateData}>Create Data</Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" show={showModalUpdateData} onHide={() => setShowModalUpdateData(false)} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{location.pathname.includes('entertainment') ? 'Update Category' : 'Update Location'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontSize: '18px', paddingBottom: '12px' }}>
                        Current name: <span style={{ fontWeight: 'bold' }}>{selectedData.name}</span>
                    </p>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>New name</Form.Label>
                            <Form.Control
                                id="name"
                                type="text"
                                value={updateData.name}
                                onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalUpdateData(false)}>Cancel</Button>
                    <Button variant="success" onClick={handleUpdateData}>Update Data</Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" show={showModalDeleteData} onHide={() => setShowModalDeleteData(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure want to delete this data?</p>
                    <p className="m-0">ID: <span style={{ fontWeight: 'bold' }}>{selectedData.id}</span></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalDeleteData(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteData}>Delete Data</Button>
                </Modal.Footer>
            </Modal>

            <FooterComponent />
        </div >
    );
};


export default Admin;
