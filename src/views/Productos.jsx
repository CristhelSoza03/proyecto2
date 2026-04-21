import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetasProductos from "../components/productos/TarjetasProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*, categorias(*)");
      
      console.log("Productos con categorías joined:", data);
      if (error) throw error;
      setProductos(data);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h3><i className="bi-bag-heart-fill me-2"></i> Gestión de Productos</h3>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg me-2"></i> Nuevo Producto
          </Button>
        </Col>
      </Row>

      <hr />

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <TarjetasProductos productos={productos} refrescar={obtenerProductos} />
      )}

      <ModalRegistroProducto
        mostrar={mostrarModal}
        alCerrar={() => setMostrarModal(false)}
        alGuardar={() => {
          setMostrarModal(false);
          obtenerProductos();
          setToast({ mostrar: true, mensaje: "Producto guardado", tipo: "exito" });
        }}
      />

      <NotificacionOperacion
        {...toast}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Productos;