import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Linkify from 'react-linkify';
import { Container, Row, Col, Image, Card, Form, Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import { fetchUserProfile } from '../../api/User';
import { fetchAllMessagesByRoomId, fetchSendMessage, fetchSendImageMessage } from '../../api/Messages';
import { socketIo } from '../../middleware/socket';
import { getLinkPreview } from 'link-preview-js';
import { useNotification } from '../../components/Notification';

const Chat = () => {
    const [user, setUser] = useState({});
    const [member, setMember] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showModalImage, setShowModalImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [linkPreviews, setLinkPreviews] = useState({});
    const messagesEndRef = useRef(null);
    const cardBodyRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { showNotification } = useNotification();
    const location = useLocation();
    const id = location.pathname.split('/')[2];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfileData = async () => {
            try {
                const response = await fetchUserProfile();
                setUser(response.data);
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        fetchUserProfileData();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetchAllMessagesByRoomId(id);
                setMember(response.data.members);
                setMessages(response.data.messages);
                scrollToBottom();
            } catch (error) {
                showNotification('Failed to fetch data', false);
            }
        };

        fetchMessages();

        const newSocket = socketIo.connect();

        newSocket.on('connect', () => {
            newSocket.emit('joinRoom', id);
        });

        const handleNewMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            fetchLinkPreview(message.message);
        };

        newSocket.on('newMessage', handleNewMessage);

        return () => {
            newSocket.emit('leaveRoom', id);
            newSocket.off('newMessage', handleNewMessage);
            newSocket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        messages.forEach((message) => {
            fetchLinkPreview(message.message);
        });
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleScroll = () => {
            if (cardBodyRef.current) {
                const scrollTop = cardBodyRef.current.scrollTop;
                const scrollHeight = cardBodyRef.current.scrollHeight;
                const clientHeight = cardBodyRef.current.clientHeight;
                const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
                setShowScrollButton(!atBottom);
            }
        };
    
        if (cardBodyRef.current) {
            cardBodyRef.current.addEventListener('scroll', handleScroll);
        }
    
        return () => {
            if (cardBodyRef.current) {
                cardBodyRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const fetchLinkPreview = async (text) => {
        const urls = text.match(/\bhttps?:\/\/\S+/gi);
        if (urls) {
            for (const url of urls) {
                if (!linkPreviews[url]) {
                    try {
                        const data = await getLinkPreview(url);
                        setLinkPreviews((prev) => ({ ...prev, [url]: data }));
                    } catch (error) {
                        console.error('Error fetching link preview:', error);
                    }
                }
            }
        }
    };

    const handleSendMessage = async () => {
        try {
            const response = await fetchSendMessage(id, newMessage);
            setNewMessage('');
            showNotification(response.message);
            scrollToBottom();
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const isImageLink = (message) => {
        return /\.(jpeg|jpg|png|gif)$/i.test(message.message);
    };

    const handleImageClickShowModalImage = (messageImg) => {
        setSelectedImage(messageImg);
        setShowModalImage(true);
    };

    const handleImageUpload = async (e) => {
        const formData = new FormData();
        formData.append('imageMessage', e.target.files[0]);

        try {
            const response = await fetchSendImageMessage(id, formData);
            showNotification(response.message);
        } catch (error) {
            showNotification(error.response.data.message, false);
        }
    };

    const handleImageClick = () => {
        document.getElementById('imageInput').click();
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const chatMember = member.find((m) => m.username !== user.username);
    const isTalent = user.roles && user.roles.includes('talent');

    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }} fluid>
                <Row xl={2} className="d-flex justify-content-center align-items-center">
                    <Card className="d-flex flex-column" style={{ padding: '16px' }}>
                        <h3 style={{ marginBottom: '24px', borderBottom: '1px solid #00A47F' }}>
                            <a href="#" onClick={() => navigate(-1)} style={{ textDecoration: 'none', color: '#00A47F' }}>&#129136; </a>
                            {chatMember?.username}
                        </h3>
                        <Row>
                            <Card.Body ref={cardBodyRef} className="p-0 pt-3 d-flex flex-column" style={{ overflow: 'auto', height: '608px' }}>
                                {messages.map((message) => (
                                    <Row key={message._id} className={`m-0 d-flex ${message.username === user.username ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <Col xs={11} md={7} xl={7}>
                                            <Card style={{ padding: '16px', marginBottom: '18px' }}>
                                                <Row className="d-flex justify-content-start align-items-start">
                                                    <Image className="p-0 m-2" src={message.imageProfile} style={{ width: '48px', height: '48px', objectFit: 'cover' }} roundedCircle />
                                                    <Col className="p-0 me-2" xs={9} md={9} xl={9}>
                                                        <h5 className="mt-2">
                                                            {message.username === user.username ? 'You' : message.username}
                                                        </h5>
                                                        <hr style={{ margin: '0', borderTop: '3px solid #00A47F' }} />
                                                        {isImageLink(message) ? (
                                                            <a href={message.message} target="_blank" rel="noopener noreferrer">
                                                                <Card.Img 
                                                                    variant="top" 
                                                                    src={message.message} 
                                                                    className="pb-3" 
                                                                    style={{ maxWidth: '256px', height: 'auto', margin: '16px 0' }} 
                                                                    onClick={(e) => { e.preventDefault(); handleImageClickShowModalImage(message.message); }} 
                                                                />
                                                            </a>
                                                        ) : (
                                                            <Card.Text className="pt-2 pb-3" style={{ minHeight: '64px', whiteSpace: 'pre-wrap' }}>
                                                                <Linkify target="_blank" rel="noopener noreferrer">{message.message}</Linkify>
                                                            </Card.Text>
                                                        )}
                                                        {message.message.match(/\bhttps?:\/\/\S+/gi)?.map((url) => (
                                                            !url.match(/\.(jpg|jpeg|png|gif|pdf)$/i) && linkPreviews[url] ? (
                                                                <Card key={url} className="mt-2" style={{ marginBottom: '24px' }}>
                                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                                        <Card.Img variant="top" src={linkPreviews[url].images?.[0]} style={{ width: '192px', maxHeight: '160px', margin: '16px' }} />
                                                                    </a>
                                                                    <Card.Body>
                                                                        <Card.Title style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                                {linkPreviews[url].title}
                                                                            </a>
                                                                        </Card.Title>
                                                                        <Card.Text style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                                            {linkPreviews[url].description}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            ) : null
                                                        ))}
                                                    </Col>
                                                </Row>
                                                <small style={{ position: 'absolute', right: '12px', bottom: '8px' }}>
                                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </small>
                                            </Card>
                                        </Col>
                                    </Row>
                                ))}
                                <div ref={messagesEndRef} />
                            </Card.Body>
                        </Row>
                        <Row className="pt-2 d-flex align-items-center" style={{ borderTop: '1px solid #00A47F' }}>
                            <Col xs={2} md={1} xl={1} className="p-0">
                                <DropdownButton
                                    drop="up"
                                    variant="secondary"
                                    title="⋮"
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ padding: '8px' }}
                                >
                                    <Dropdown.Item href="#" onClick={handleImageClick}><img src="/icon/image-icon.png" alt="Image" /> Image</Dropdown.Item>
                                    <input id="imageInput" type="file" accept=".jpg, .jpeg, .png" style={{ display: 'none' }} onChange={handleImageUpload} />

                                    {isTalent && (
                                        <Dropdown.Item href="#"><img src="/icon/invoice-icon.png" alt="Invoice" /> Create Invoice</Dropdown.Item>
                                    )}
                                </DropdownButton>
                            </Col>
                            <Col xs={7} md={9} xl={9} style={{ borderLeft: '1px solid #00A47F' }}>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '8px', overflowY: 'auto', resize: 'none' }}
                                    rows={1}
                                />
                            </Col>
                            <Col>
                                <Button type="submit" variant="success" onClick={handleSendMessage} style={{ width: '100%', padding: '8px' }}>Send</Button>
                            </Col>
                        </Row>
                        {showScrollButton && (
                            <Button
                                variant="success"
                                style={{ position: 'absolute', bottom: '96px', right: '32px', borderRadius: '50%' }}
                                onClick={scrollToBottom}
                            >
                                &#129139;
                            </Button>
                        )}
                    </Card>
                </Row>
            </Container>
            <Modal show={showModalImage} onHide={() => setShowModalImage(false)} centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedImage} alt="Selected Image" style={{ width: '100%', height: 'auto' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};


export default Chat;
