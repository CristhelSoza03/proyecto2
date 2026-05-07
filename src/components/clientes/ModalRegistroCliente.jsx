import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejoCambioInput,
  agregarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleAgregar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarCliente();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Cliente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nuevoCliente.nombre || ""}
                  onChange={manejoCambioInput}
                  placeholder="Nombre y Apellido"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={nuevoCliente.correo || ""}
                  onChange={manejoCambioInput}
                  placeholder="ejemplo@correo.com"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono / Celular</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={nuevoCliente.telefono || ""}
                  onChange={manejoCambioInput}
                  placeholder="Número de contacto"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleAgregar}
          disabled={deshabilitado}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;
