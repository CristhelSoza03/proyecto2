import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCategoria = ({
  mostrarModal,
  setMostrarModal,
  nuevaCategoria,
  manejoCambioInput,
  agregarCategoria,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleAgregar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarCategoria();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
        <Modal.Title className="modal-title h4">Agregar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="small text-secondary mb-1">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevaCategoria.nombre}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre"
              required
              autoFocus
              className="py-2"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="small text-secondary mb-1">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="descripcion"
              value={nuevaCategoria.descripcion}
              onChange={manejoCambioInput}
              placeholder="Ingresa la descripción"
              className="py-2"
            />
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" className="px-4 py-2" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            className="px-4 py-2" 
            onClick={handleAgregar}
            disabled={deshabilitado}
          >
            Guardar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRegistroCategoria;