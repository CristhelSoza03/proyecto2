import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Pagina404 = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1 className="display-1 fw-bold text-danger">404</h1>
          <h2 className="mb-4">¡Página no encontrada!</h2>
          <p className="lead mb-5">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              <i className="bi-house-door-fill me-2"></i>
              Volver al Inicio
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Pagina404;