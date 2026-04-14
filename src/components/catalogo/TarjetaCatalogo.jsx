import React from "react";
import { Card, Badge } from "react-bootstrap";

const TarjetaCatalogo = ({ producto }) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={producto.imagen_url || "https://via.placeholder.com/300x200?text=Sin+Imagen"}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{producto.nombre_producto}</Card.Title>
          <Badge bg="info" className="text-dark">
            {producto.categorias?.nombre_categoria || "Sin categoría"}
          </Badge>
        </div>
        <Card.Text className="text-muted small flex-grow-1">
          {producto.descripcion_producto}
        </Card.Text>
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-primary">${producto.precio_producto}</h5>
          <small className="text-muted">Stock: {producto.stock_producto}</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaCatalogo;