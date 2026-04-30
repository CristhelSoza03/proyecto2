import React from "react";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";

const TarjetasProductos = ({ productos, refrescar, abrirModalEdicion, abrirModalEliminacion }) => {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {productos.map((p) => (
        <Col key={p.id_producto || p.id}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Img
              variant="top"
              src={p.imagen_url || "https://via.placeholder.com/300x200?text=Sin+Imagen"}
              style={{ height: "200px", objectFit: "cover" }}
            />
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <Card.Title className="mb-0">{p.nombre_producto}</Card.Title>
                <Badge bg="info" className="text-dark">
                  {p.categorias?.nombre || p.categorias?.nombre_categoria || "Sin categoría"}
                </Badge>
              </div>
              <Card.Text className="text-muted small flex-grow-1">
                {p.descripcion_producto}
              </Card.Text>
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-primary">${p.precio_producto}</h5>
                <small className="text-muted">Stock: {p.stock}</small>
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 d-flex justify-content-between">
              <Button 
                variant="outline-warning" 
                size="sm"
                onClick={() => abrirModalEdicion(p)}
              >
                <i className="bi-pencil"></i>
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => abrirModalEliminacion(p)}
              >
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