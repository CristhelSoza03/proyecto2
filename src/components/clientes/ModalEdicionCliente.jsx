import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,
  actualizarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarCliente();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
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
                  value={clienteEditar.nombre || ""}
                  onChange={manejoCambioInputEdicion}
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
                  value={clienteEditar.correo || ""}
                  onChange={manejoCambioInputEdicion}
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono / Celular</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={clienteEditar.telefono || ""}
                  onChange={manejoCambioInputEdicion}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={deshabilitado}
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCliente;
