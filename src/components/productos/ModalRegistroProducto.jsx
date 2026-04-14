import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalRegistroProducto = ({ mostrar, alCerrar, alGuardar }) => {
  const [producto, setProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    precio_producto: "",
    stock_producto: "",
    imagen_url: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("productos").insert([producto]);
      if (error) throw error;
      alGuardar();
    } catch (err) {
      console.error("Error al guardar:", err.message);
    }
  };

  return (
    <Modal show={mostrar} onHide={alCerrar}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre_producto"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              name="precio_producto"
              type="number"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              name="stock_producto"
              type="number"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen URL</Form.Label>
            <Form.Control name="imagen_url" onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={alCerrar}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroProducto;