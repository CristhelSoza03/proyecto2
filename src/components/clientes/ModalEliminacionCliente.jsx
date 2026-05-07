import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCliente,
  cliente,
}) => {
  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Está seguro de que desea eliminar al cliente{" "}
          <strong>
            {cliente?.nombre} {cliente?.apellido}
          </strong>? Esta acción no se puede deshacer.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
        >
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarCliente}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;
