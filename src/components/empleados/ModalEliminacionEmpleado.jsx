import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionEmpleado = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarEmpleado,
  empleado,
}) => {
  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Está seguro de que desea eliminar al empleado{" "}
          <strong>
            {empleado?.nombre} {empleado?.apellido}
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
        <Button variant="danger" onClick={eliminarEmpleado}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionEmpleado;
