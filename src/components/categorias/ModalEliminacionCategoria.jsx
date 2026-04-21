import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEliminacionCategoria = ({ show, onHide, categoria, onUpdate, setToast }) => {
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id_categoria", categoria.id_categoria);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Categoría eliminada con éxito.",
        tipo: "exito",
      });
      onUpdate();
      onHide();
    } catch (error) {
      console.error("Error al eliminar categoría:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar. Asegúrese de que no haya productos vinculados a esta categoría.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="profe-modal">
      <Modal.Header closeButton className="border-0 px-4 pt-4">
        <Modal.Title className="fw-extrabold text-accent">Eliminar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <p className="fs-5 fw-medium text-main">
          ¿Estás seguro de que deseas eliminar la categoría <strong>{categoria?.nombre_categoria || categoria?.nombre}</strong>?
        </p>
        <p className="text-accent small fw-bold">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Esta acción es irreversible y podría afectar a productos vinculados.
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4">
        <Button variant="outline-primary" onClick={onHide} className="px-4">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEliminar} disabled={loading} className="px-4 bg-accent">
          {loading ? "Eliminando..." : "Confirmar Eliminación"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCategoria;