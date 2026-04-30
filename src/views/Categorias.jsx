import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado de carga inicial
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

  // Imagen 7: Métodos de manejo de variables de estado (adaptados para Categorías)
  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [tablaActual, setTablaActual] = useState("categorias");
  const [columnasActuales, setColumnasActuales] = useState({
    nombre: "nombre",
    descripcion: "descripcion"
  });

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

      const colId = categoriaEditar.id_original_name || "id_categoria";
      const colNombre = categoriaEditar.nombre_original_name || "nombre";
      const colDescripcion = categoriaEditar.descripcion_original_name || "descripcion";
      
      console.log(`Intentando actualizar en ${tablaActual} usando ${colId}=${categoriaEditar.id_categoria}`);

      const { data, error } = await supabase
        .from(tablaActual)
        .update({
          [colNombre]: categoriaEditar.nombre_categoria,
          [colDescripcion]: categoriaEditar.descripcion_categoria,
        })
        .eq(colId, categoriaEditar.id_categoria)
        .select();

      if (error) {
        console.error("Error al actualizar categoría:", error);
        setToast({
          mostrar: true,
          mensaje: `Error de Supabase: ${error.message}`,
          tipo: "error",
        });
        return;
      }

      if (!data || data.length === 0) {
        console.warn("No se afectaron filas. Posiblemente RLS activo o ID no encontrado.");
        setToast({
          mostrar: true,
          mensaje: "No se pudo actualizar. Verifique si tiene permisos (RLS) en Supabase.",
          tipo: "advertencia",
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

      const colId = categoriaAEliminar.id_original_name || "id_categoria";

      console.log(`Intentando eliminar en ${tablaActual} usando ${colId}=${categoriaAEliminar.id_categoria}`);

      const { data, error } = await supabase
        .from(tablaActual)
        .delete()
        .eq(colId, categoriaAEliminar.id_categoria)
        .select();

      if (error) {
        console.error("Error al eliminar categoría:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error de Supabase: ${error.message}`,
          tipo: "error",
        });
        return;
      }

      if (!data || data.length === 0) {
        console.warn("No se afectaron filas al eliminar. Posiblemente RLS activo.");
        setToast({
          mostrar: true,
          mensaje: "No se pudo eliminar. Verifique si tiene permisos (RLS) en Supabase.",
          tipo: "advertencia",
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
      
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

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
        setCategorias([]);
        return;
      }

      // Detectar nombres de columnas
      const primerRegistro = data[0];
      const detectado = {
        nombre: primerRegistro.nombre_categoria ? "nombre_categoria" : "nombre",
        descripcion: primerRegistro.descripcion_categoria ? "descripcion_categoria" : "descripcion"
      };
      setColumnasActuales(detectado);
      
      const datosMapeados = data.map(cat => ({
        id_categoria: cat.id_categoria || cat.id,
        id_original_name: cat.id_categoria ? "id_categoria" : "id",
        nombre_categoria: cat.nombre_categoria || cat.nombre || "Sin nombre",
        nombre_original_name: cat.nombre_categoria ? "nombre_categoria" : "nombre",
        descripcion_categoria: cat.descripcion_categoria || cat.descripcion || "Sin descripción",
        descripcion_original_name: cat.descripcion_categoria ? "descripcion_categoria" : "descripcion"
      }));
      
      setCategorias(datosMapeados);
    } catch (err) {
      console.error("Exception in cargarCategorias:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(textoLower) ||
          (cat.descripcion_categoria && cat.descripcion_categoria.toLowerCase().includes(textoLower))
      );
      setCategoriasFiltradas(filtradas);
    }
  }, [textoBusqueda, categorias]);

  // Ajustar página actual si queda fuera de rango al filtrar o eliminar
  useEffect(() => {
    const totalPaginas = Math.ceil(categoriasFiltradas.length / registrosPorPagina);
    if (paginaActual > totalPaginas && totalPaginas > 0) {
      establecerPaginaActual(totalPaginas);
    }
  }, [categoriasFiltradas, registrosPorPagina, paginaActual]);

  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

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
          mensaje: "El nombre es obligatorio.",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);

      const { error } = await supabase.from(tablaActual).insert([
        {
          [columnasActuales.nombre]: nuevaCategoria.nombre,
          [columnasActuales.descripcion]: nuevaCategoria.descripcion,
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
              className="profe-add-btn rounded-3 px-3 py-2 shadow-sm text-white"
              style={{ backgroundColor: '#007bff', border: 'none' }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Nueva Categoría
            </Button>
          </Col>
        </Row>
        <hr className="profe-separator" />

        {/* Cuadro de búsqueda debajo de la línea divisoria */}
        <Row className="mb-4">
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarBusqueda}
              placeholder="Buscar..."
            />
          </Col>
        </Row>

        {/* Spinner mientras se cargan las categorías */}
        {cargando && (
          <Row className="text-center my-5">
            <Col>
              <Spinner animation="border" variant="success" size="lg" />
              <p className="mt-3 text-muted">Cargando categorías...</p>
            </Col>
          </Row>
        )}

        {/* Mensaje de no coincidencias solo cuando hay búsqueda y no hay resultados */}
        {!cargando && textoBusqueda.trim() && categoriasFiltradas.length === 0 && (
          <Row className="mb-4">
            <Col>
              <Alert variant="info" className="text-center">
                <i className="bi bi-info-circle me-2"></i>
                No se encontraron categorías que coincidan con "{textoBusqueda}".
              </Alert>
            </Col>
          </Row>
        )}

        {/* Lista de categorías filtradas */}
        {!cargando && categoriasFiltradas.length > 0 ? (
          <Row>
            {/* Implementación de las tarjetas para móviles */}
            <Col xs={12} sm={12} md={12} className="d-lg-none">
              <TarjetaCategoria
                categorias={categoriasPaginadas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
              />
            </Col>

            {/* Implementación de la tabla para pantallas grandes */}
            <Col lg={12} className="d-none d-lg-block">
              <TablaCategorias
                categorias={categoriasPaginadas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
              />
            </Col>
          </Row>
        ) : (
          !cargando && !textoBusqueda.trim() && (
            <Row className="text-center my-5">
              <Col>
                <i className="bi bi-bookmark-x text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 text-muted">No se encontraron categorías.</p>
              </Col>
            </Row>
          )
        )}

        {/* Paginación */}
        {categoriasFiltradas.length > 0 && (
          <Paginacion
            registrosPorPagina={registrosPorPagina}
            totalRegistros={categoriasFiltradas.length}
            paginaActual={paginaActual}
            establecerPaginaActual={establecerPaginaActual}
            establecerRegistrosPorPagina={establecerRegistrosPorPagina}
          />
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