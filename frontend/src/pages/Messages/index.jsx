import { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Card, ListGroup, Badge } from 'react-bootstrap';
import NavbarComponent from '../../components/Navbar';
import { fetchUserProfile } from '../../api/User';
import { fetchAllMessagesByRoomId } from '../../api/Messages';

const Messages = () => {
    const [user, setUser] = useState({});
    const [messageRooms, setMessageRooms] = useState([]);

    useEffect(() => {
        const fetchUserProfileData = async () => {
            try {
                const response = await fetchUserProfile();
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfileData();
    }, []);

    useEffect(() => {
        const fetchMessageRooms = async () => {
            if (user.messageRoom_id && user.messageRoom_id.length > 0) {
                const rooms = await Promise.all(user.messageRoom_id.map(async (roomId) => {
                    try {
                        const response = await fetchAllMessagesByRoomId(roomId);
                        const messages = response.data.messages;
                        const latestMessage = messages[messages.length - 1];
                        const otherMembers = response.data.members.filter(member => member.username !== user.username);
                        return {
                            roomId,
                            latestMessage,
                            otherMembers
                        };
                    } catch (error) {
                        console.error('Error fetching messages:', error);
                        return null;
                    }
                }));

                rooms.sort((a, b) => {
                    if (!a.latestMessage || !b.latestMessage) return 0;
                    return new Date(b.latestMessage.timestamp) - new Date(a.latestMessage.timestamp);
                });
                setMessageRooms(rooms.filter(room => room !== null));
            }
        };

        if (user.messageRoom_id) {
            fetchMessageRooms();
        }
    }, [user]);

    return (
        <div>
            <NavbarComponent />
            <Container style={{ paddingTop: '32px' }}>
                <Row className="d-flex justify-content-center align-items-center">
                    <Card className="d-flex flex-column" style={{ padding: '16px' }}>
                        <h2 style={{ marginBottom: '24px', borderBottom: '1px solid #00A47F' }}>Messages</h2>
                        <Row>
                            <Card.Body className="p-2 pt-3 d-flex flex-column align-items-center">
                                {messageRooms.length === 0 ? (
                                    <p>No messages available.</p>
                                ) : (
                                    <ListGroup variant="flush" className="d-flex justify-content-center align-items-center w-100" style={{ paddingBottom: '96px' }}>
                                        {messageRooms.map(room => (
                                            <ListGroup.Item key={room.roomId} action href={`/chat/${room.roomId}`} className="w-100">
                                                <Row className="d-flex justify-content-center align-items-start" style={{ borderBottom: '1px solid #00A47F' }}>
                                                    <Image className="p-0 m-2" src={room.otherMembers[0]?.imageProfile} style={{ width: '64px', height: '64px', objectFit: 'cover' }} roundedCircle />
                                                    <Col className="p-0 pt-2 me-2">
                                                        <h5><span style={{ borderBottom: '1px solid #00A47F' }}>{room.otherMembers[0]?.username}</span></h5>
                                                        <p className="pt-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                            <b>{room.latestMessage?.username === user.username ? 'You' : room.latestMessage?.username}: </b>
                                                            {room.latestMessage?.message.match(/\.(jpg|jpeg|png|gif)$/i) ? "Image" : room.latestMessage?.message}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <span style={{ position: 'absolute', right: '10px', bottom: '19px' }}>
                                                    {new Date(room.latestMessage?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>

                                                <span style={{ position: 'absolute', right: '10px', top: '8px' }}>
                                                    <Badge bg="success" pill>!</Badge>
                                                </span>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Row>
                    </Card>
                </Row>
            </Container>
        </div>
    );
};


export default Messages;
