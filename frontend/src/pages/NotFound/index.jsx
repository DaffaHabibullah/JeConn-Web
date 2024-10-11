import { useNavigate } from "react-router-dom";
import { Container, Row, Image } from "react-bootstrap";
import { checkAuth } from "../../middleware/checkAuth";

const NotFound = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const role = checkAuth(token);

                if (role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            } catch (error) {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#00A47F', minHeight: '100vh' }}>
            <Container>
                <Row className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#00A47F' }}>
                    <Image style={{ width: '512px', height: '384px', backgroundColor: '#00A47F' }} src="images/not-found-image.jpg" alt="404 Not Found" />
                    <h1 style={{ backgroundColor: '#00A47F', color: '#FFFFFF', textAlign: 'center' }}>404 Not Found</h1>
                    <span style={{ backgroundColor: '#00A47F', color: '#FFFFFF', textAlign: 'center' }}>Halaman yang anda cari tidak ditemukan.</span>
                    <p className="mt-3" style={{ backgroundColor: '#00A47F', color: '#FFFFFF', textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }} onClick={handleClick}>Kembali ke Halaman Utama</p>
                </Row>
            </Container>
        </div>
    );
};


export default NotFound;
