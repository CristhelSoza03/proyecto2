import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

const TarjetasProductos = ({ productos, refrescar }) => {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {productos.map((p) => (
        <Col key={p.id}>
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src={p.imagen_url || "https://via.placeholder.com/150"}
              style={{ height: "150px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{p.nombre_producto}</Card.Title>
              <Card.Text className="text-muted small">
                {p.descripcion_producto}
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold text-primary">${p.precio_producto}</span>
                <span className="badge bg-secondary">Stock: {p.stock_producto}</span>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 d-flex justify-content-between">
              <Button variant="outline-primary" size="sm">
                <i className="bi-pencil"></i>
              </Button>
              <Button variant="outline-danger" size="sm">
                <i className="bi-trash"></i>
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TarjetasProductos;