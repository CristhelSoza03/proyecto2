import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProducto = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarProducto,
  producto,
}) => {
  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="h5">Eliminar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <i className="bi bi-exclamation-triangle text-danger mb-3" style={{ fontSize: '3rem' }}></i>
        <p className="mb-0">
          ¿Estás seguro de que deseas eliminar el producto <strong>{producto?.nombre_producto}</strong>?
        </p>
        <p className="text-muted small mt-2">
          Esta acción no se puede deshacer.
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button variant="secondary" className="px-4" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" className="px-4" onClick={eliminarProducto}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;
