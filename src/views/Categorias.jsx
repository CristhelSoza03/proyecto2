import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import NotificacionOperacion from "../components/NotificacionOperacion";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado de carga inicial
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre: "",
    descripcion: "",
  });

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id_categoria: categoria.id_categoria,
      nombre: categoria.nombre_categoria,
      descripcion: categoria.descripcion_categoria,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) {
        console.error("Error al cargar categorías:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar categorías.",
          tipo: "error",
        });
        return;
      }
      
      // Mapear los datos de la BD a los nombres de campo solicitados por el profesor
      const datosMapeados = (data || []).map(cat => ({
        id_categoria: cat.id_categoria,
        nombre_categoria: cat.nombre,
        descripcion_categoria: cat.descripcion
      }));
      
      setCategorias(datosMapeados);
    } catch (err) {
      console.error("Excepción al cargar categorías:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar categorías.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre || !nuevaCategoria.nombre.trim()) {
        setToast({
          mostrar: true,
          mensaje: "El nombre de la categoría es obligatorio.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("categorias").insert([
        {
          nombre: nuevaCategoria.nombre,
          descripcion: nuevaCategoria.descripcion,
        },
      ]);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Categoría "${nuevaCategoria.nombre}" creada con éxito.`,
        tipo: "exito",
      });

      setNuevaCategoria({ nombre: "", descripcion: "" });
      setMostrarModal(false);
      await cargarCategorias();

    } catch (err) {
      console.error("Error al agregar categoría:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Hubo un error al crear la categoría.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col xs={7} md={8}>
            <h3 className="profe-page-title mb-0">
              <i className="bi bi-bookmark-plus-fill me-2" style={{ fontSize: '1.5rem' }}></i>
              Categorías
            </h3>
          </Col>
          <Col xs={5} md={4} className="text-end">
            <Button onClick={() => setMostrarModal(true)} className="profe-add-btn">
              <i className="bi bi-plus me-1"></i>
              Nueva Categoría
            </Button>
          </Col>
        </Row>
        <hr className="profe-separator" />

        {/* Spinner mientras se cargan las categorías */}
        {cargando && (
          <Row className="text-center my-5">
            <Col>
              <Spinner animation="border" variant="success" size="lg" />
              <p className="mt-3 text-muted">Cargando categorías...</p>
            </Col>
          </Row>
        )}

        {/* Lista de categorías cargadas */}
        {!cargando && categorias.length > 0 && (
          <Row>
            <Col lg={12} className="d-none d-lg-block">
              <TablaCategorias
                categorias={categorias}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
              />
            </Col>
          </Row>
        )}

        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejoCambioInput={manejoCambioInput}
          agregarCategoria={agregarCategoria}
        />

        {categoriaEditar && (
          <ModalEdicionCategoria
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            categoria={categoriaEditar}
            onUpdate={cargarCategorias}
            setToast={setToast}
          />
        )}

        {categoriaAEliminar && (
          <ModalEliminacionCategoria
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            categoria={categoriaAEliminar}
            onUpdate={cargarCategorias}
            setToast={setToast}
          />
        )}

        <NotificacionOperacion
          mostrar={toast.mostrar}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={() => setToast({ ...toast, mostrar: false })}
        />
      </Container>
    </div>
  );
};

export default Categorias;