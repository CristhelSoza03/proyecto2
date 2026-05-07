import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionEmpleado = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  empleadoEditar,
  manejoCambioInputEdicion,
  actualizarEmpleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarEmpleado();
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
        <Modal.Title>Editar Empleado</Modal.Title>
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
                  value={empleadoEditar.nombre || ""}
                  onChange={manejoCambioInputEdicion}
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
                  value={empleadoEditar.apellido || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>PIN de Acceso (Dejar en blanco para no cambiar)</Form.Label>
                <Form.Control
                  type="password"
                  name="pin_acceso"
                  value={empleadoEditar.pin_acceso || ""}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Nuevo PIN"
                  maxLength={4}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Empleado *</Form.Label>
                <Form.Select
                  name="tipo_empleado"
                  value={empleadoEditar.tipo_empleado || ""}
                  onChange={manejoCambioInputEdicion}
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

export default ModalEdicionEmpleado;
