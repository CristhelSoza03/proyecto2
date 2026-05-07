import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroEmpleado = ({
  mostrarModal,
  setMostrarModal,
  nuevoEmpleado,
  manejoCambioInput,
  agregarEmpleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleAgregar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarEmpleado();
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
        <Modal.Title>Nuevo Empleado</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nuevoEmpleado.nombre || ""}
                  onChange={manejoCambioInput}
                  placeholder="Nombre"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={nuevoEmpleado.apellido || ""}
                  onChange={manejoCambioInput}
                  placeholder="Apellido"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>PIN de Acceso *</Form.Label>
                <Form.Control
                  type="password"
                  name="pin_acceso"
                  value={nuevoEmpleado.pin_acceso || ""}
                  onChange={manejoCambioInput}
                  placeholder="PIN de 4 dígitos"
                  maxLength={4}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Empleado *</Form.Label>
                <Form.Select
                  name="tipo_empleado"
                  value={nuevoEmpleado.tipo_empleado || ""}
                  onChange={manejoCambioInput}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Cajero">Cajero</option>
                </Form.Select>
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

export default ModalRegistroEmpleado;
