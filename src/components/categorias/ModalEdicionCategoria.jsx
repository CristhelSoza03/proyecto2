import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEdicionCategoria = ({ show, onHide, categoria, onUpdate, setToast }) => {
  const [datos, setDatos] = useState({
    nombre: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoria) {
      setDatos({
        nombre: categoria.nombre_categoria || categoria.nombre || "",
        descripcion: categoria.descripcion_categoria || categoria.descripcion || "",
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      if (!datos.nombre || !datos.nombre.trim()) {
        setToast({
          mostrar: true,
          mensaje: "El nombre es obligatorio.",
          tipo: "advertencia",
        });
        return;
      }

      setLoading(true);
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre_categoria: datos.nombre,
          descripcion_categoria: datos.descripcion,
        })
        .eq("id_categoria", categoria.id_categoria);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Categoría actualizada con éxito.",
        tipo: "exito",
      });
      onUpdate();
      onHide();
    } catch (error) {
      console.error("Error al actualizar categoría:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar la categoría.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="profe-modal">
      <Modal.Header closeButton className="border-0 px-4 pt-4">
        <Modal.Title className="fw-extrabold text-primary">Editar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-muted small text-uppercase">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              placeholder="Nombre de la categoría"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold text-muted small text-uppercase">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la categoría"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4">
        <Button variant="outline-primary" onClick={onHide} className="px-4">
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleGuardar}
          disabled={loading || !datos.nombre || !datos.nombre.trim()}
          className="px-4"
        >
          {loading ? "Sincronizando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategoria;