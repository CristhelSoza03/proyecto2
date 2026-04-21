import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCategoria = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion
}) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  return (
    <div>
      {categorias.map((categoria) => {
            const tarjetaActiva = idTarjetaActiva === categoria.id_categoria;

            return (
              <Card
                key={categoria.id_categoria}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-categoria-contenedor"
                onClick={() => alternarTarjetaActiva(categoria.id_categoria)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(categoria.id_categoria);
                  }
                }}
                aria-label={`Categoría ${categoria.nombre_categoria}`}
              >
                <Card.Body
                  className={`p-3 tarjeta-categoria-cuerpo ${
                    tarjetaActiva
                      ? "tarjeta-categoria-cuerpo-activo"
                      : "tarjeta-categoria-cuerpo-inactivo"
                  }`}
                >
                  <Row className="align-items-center gx-0">
                    <Col xs={2} className="d-flex justify-content-center">
                      <div className="bg-light d-flex align-items-center justify-content-center rounded-3 tarjeta-categoria-placeholder-imagen" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-bookmark fs-4 text-secondary"></i>
                      </div>
                    </Col>

                    <Col xs={7} className="text-start ps-2">
                      <div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                        {categoria.nombre_categoria}
                      </div>
                      <div className="text-muted small text-truncate">
                        {categoria.descripcion_categoria}
                      </div>
                    </Col>

                    <Col xs={3} className="text-end pe-2">
                      <div className="fw-bold small text-dark">Activa</div>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                    className="tarjeta-categoria-capa"
                  >
                    <div
                      className="d-flex gap-2 tarjeta-categoria-botones-capa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirModalEdicion(categoria);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Editar ${categoria.nombre_categoria}`}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(categoria);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Eliminar ${categoria.nombre_categoria}`}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
    </div>
  );
};

export default TarjetaCategoria;