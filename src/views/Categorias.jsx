import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
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
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCategoriaEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const actualizarCategoria = async () => {
    try {
      if (!categoriaEditar.nombre_categoria.trim()) {
        setToast({
          mostrar: true,
          mensaje: "El nombre es obligatorio.",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      const { error } = await supabase
        .from("categorias")
        .update({
          nombre: categoriaEditar.nombre_categoria,
          descripcion: categoriaEditar.descripcion_categoria,
        })
        .eq("id_categoria", categoriaEditar.id_categoria);

      if (error) {
        console.error("Error al actualizar categoría:", error);
        setToast({
          mostrar: true,
          mensaje: `Error: ${error.message}`,
          tipo: "error",
        });
        return;
      }

      await cargarCategorias();
      setToast({
        mostrar: true,
        mensaje: `Categoría "${categoriaEditar.nombre_categoria}" actualizada exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar categoría.",
        tipo: "error",
      });
      console.error("Excepción al actualizar categoría:", err.message);
    }
  };

  const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;
    try {
      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id_categoria", categoriaAEliminar.id_categoria);

      if (error) {
        console.error("Error al eliminar categoría:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar la categoría ${categoriaAEliminar.nombre_categoria}.`,
          tipo: "error",
        });
        return;
      }

      await cargarCategorias();
      setToast({
        mostrar: true,
        mensaje: `Categoría ${categoriaAEliminar.nombre_categoria} eliminada exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar categoría.",
        tipo: "error",
      });
      console.error("Excepción al eliminar categoría:", err.message);
    }
  };

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar(categoria);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      
      // Intentar cargar categorías de 'categorias' o 'productos_categorias' si falla
      let response = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if ((!response.data || response.data.length === 0) && !response.error) {
        console.warn("No hay datos en 'categorias', probando 'productos_categorias'...");
        const altResponse = await supabase
          .from("productos_categorias")
          .select("*");
        if (altResponse.data && altResponse.data.length > 0) {
          response = altResponse;
        }
      }

      const { data, error } = response;
      console.log("Supabase response final:", { data, error });

      if (error) {
        console.error("Error fetching categories:", error);
        setToast({
          mostrar: true,
          mensaje: "Error de Supabase: " + error.message,
          tipo: "error",
        });
        return;
      }

      if (!data || data.length === 0) {
        console.warn("No se encontraron datos en ninguna tabla de categorías.");
        setToast({
          mostrar: true,
          mensaje: "La base de datos respondió con 0 registros. Verifique si tiene habilitado RLS en Supabase o si los datos están en otra tabla.",
          tipo: "advertencia",
        });
        setCategorias([]);
        return;
      }
      
      setToast({
        mostrar: true,
        mensaje: `Se cargaron ${data.length} categorías exitosamente de la tabla '${response.from || 'categorias'}'.`,
        tipo: "exito",
      });
      
      const datosMapeados = data.map(cat => ({
        id_categoria: cat.id_categoria || cat.id,
        nombre_categoria: cat.nombre_categoria || cat.nombre || "Sin nombre",
        descripcion_categoria: cat.descripcion_categoria || cat.descripcion || "Sin descripción"
      }));
      
      console.log("Mapped categories:", datosMapeados);
      setCategorias(datosMapeados);
    } catch (err) {
      console.error("Exception in cargarCategorias:", err);
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
          <Col xs={8} md={9}>
            <h3 className="profe-page-title mb-0 d-flex align-items-center">
              <i className="bi bi-bookmark-plus-fill me-3" style={{ fontSize: '1.8rem' }}></i>
              Categorías
            </h3>
          </Col>
          <Col xs={4} md={3} className="text-end">
            <Button 
              onClick={() => setMostrarModal(true)} 
              className="profe-add-btn rounded-3 px-3 py-2 shadow-sm"
              style={{ backgroundColor: '#007bff', border: 'none' }}
            >
              <i className="bi bi-plus-lg fs-5"></i>
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
        {!cargando && categorias.length > 0 ? (
          <Row>
            {/* Implementación de las tarjetas para móviles */}
            <Col xs={12} sm={12} md={12} className="d-lg-none">
              <TarjetaCategoria
                categorias={categorias}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
              />
            </Col>

            {/* Implementación de la tabla para pantallas grandes */}
            <Col lg={12} className="d-none d-lg-block">
              <TablaCategorias
                categorias={categorias}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
              />
            </Col>
          </Row>
        ) : (
          !cargando && (
            <Row className="text-center my-5">
              <Col>
                <i className="bi bi-bookmark-x text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 text-muted">No se encontraron categorías.</p>
              </Col>
            </Row>
          )
        )}

        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejoCambioInput={manejoCambioInput}
          agregarCategoria={agregarCategoria}
        />

        <ModalEdicionCategoria
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          categoriaEditar={categoriaEditar}
          manejoCambioInputEdicion={manejoCambioInputEdicion}
          actualizarCategoria={actualizarCategoria}
        />

        <ModalEliminacionCategoria
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarCategoria={eliminarCategoria}
          categoria={categoriaAEliminar}
        />

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