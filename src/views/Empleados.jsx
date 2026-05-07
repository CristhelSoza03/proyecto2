import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    pin_acceso: "",
    tipo_empleado: "",
  });

  const [empleadoEditar, setEmpleadoEditar] = useState({
    id_empleado: "",
    nombre: "",
    apellido: "",
    pin_acceso: "",
    tipo_empleado: "",
  });

  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(10);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const obtenerEmpleados = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .order("id_empleado", { ascending: false });

      if (error) throw error;
      setEmpleados(data || []);
      setEmpleadosFiltrados(data || []);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar empleados: " + err.message,
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({ ...prev, [name]: value }));
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditar((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setEmpleadosFiltrados(empleados);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = empleados.filter((emp) => {
        const nombreCompleto = `${emp.nombre} ${emp.apellido}`.toLowerCase();
        const tipo = emp.tipo_empleado?.toLowerCase() || "";
        return nombreCompleto.includes(textoLower) || tipo.includes(textoLower);
      });
      setEmpleadosFiltrados(filtrados);
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, empleados]);

  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const agregarEmpleado = async () => {
    try {
      if (
        !nuevoEmpleado.nombre?.trim() ||
        !nuevoEmpleado.apellido?.trim() ||
        !nuevoEmpleado.pin_acceso ||
        !nuevoEmpleado.tipo_empleado
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("empleados").insert([nuevoEmpleado]);

      if (error) throw error;

      setNuevoEmpleado({
        nombre: "",
        apellido: "",
        pin_acceso: "",
        tipo_empleado: "",
      });

      setMostrarModal(false);
      await obtenerEmpleados();
      setToast({
        mostrar: true,
        mensaje: "Empleado registrado correctamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al agregar empleado:", err);
      setToast({
        mostrar: true,
        mensaje: "Error: " + err.message,
        tipo: "error",
      });
    }
  };

  const actualizarEmpleado = async () => {
    try {
      if (
        !empleadoEditar.nombre.trim() ||
        !empleadoEditar.apellido.trim() ||
        !empleadoEditar.tipo_empleado
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      const { id_empleado, ...datosAActualizar } = empleadoEditar;
      
      // Si el PIN está vacío, no lo actualizamos
      if (!datosAActualizar.pin_acceso) {
        delete datosAActualizar.pin_acceso;
      }

      const { error } = await supabase
        .from("empleados")
        .update(datosAActualizar)
        .eq("id_empleado", id_empleado);

      if (error) throw error;

      setMostrarModalEdicion(false);
      await obtenerEmpleados();
      setToast({
        mostrar: true,
        mensaje: "Empleado actualizado correctamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar empleado",
        tipo: "error",
      });
    }
  };

  const eliminarEmpleado = async () => {
    try {
      if (!empleadoAEliminar) return;

      const { error } = await supabase
        .from("empleados")
        .delete()
        .eq("id_empleado", empleadoAEliminar.id_empleado);

      if (error) throw error;

      setToast({ mostrar: true, mensaje: "Empleado eliminado", tipo: "exito" });
      setMostrarModalEliminacion(false);
      await obtenerEmpleados();
    } catch (err) {
      console.error("Error al eliminar:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar: " + err.message,
        tipo: "error",
      });
    }
  };

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditar({
      id_empleado: empleado.id_empleado,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      pin_acceso: "", // No mostramos el PIN actual por seguridad
      tipo_empleado: empleado.tipo_empleado,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalEliminacion(true);
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col xs={8} md={9}>
            <h3 className="profe-page-title mb-0 d-flex align-items-center">
              <i
                className="bi bi-people-fill me-3"
                style={{ fontSize: "1.8rem" }}
              ></i>
              Empleados
            </h3>
          </Col>

          <Col xs={4} md={3} className="text-end">
            <Button
              onClick={() => setMostrarModal(true)}
              className="profe-add-btn rounded-3 px-3 py-2 shadow-sm text-white"
              style={{ backgroundColor: "#007bff", border: "none" }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              <span className="d-none d-sm-inline">Nuevo Empleado</span>
              <span className="d-inline d-sm-none">Nuevo</span>
            </Button>
          </Col>
        </Row>

        <hr className="profe-separator" />

        <Row className="mb-4">
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarBusqueda}
              placeholder="Buscar por nombre o tipo..."
            />
          </Col>
        </Row>

        {cargando ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Cargando empleados...</p>
          </div>
        ) : empleadosFiltrados.length > 0 ? (
          <>
            <TablaEmpleados
              empleados={empleadosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />

            <div className="mt-4">
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={empleadosFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </div>
          </>
        ) : (
          <Alert variant="info" className="text-center">
            <i className="bi bi-info-circle me-2"></i>
            No se encontraron empleados que coincidan con la búsqueda.
          </Alert>
        )}

        <ModalRegistroEmpleado
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoEmpleado={nuevoEmpleado}
          manejoCambioInput={manejoCambioInput}
          agregarEmpleado={agregarEmpleado}
        />

        <ModalEdicionEmpleado
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          empleadoEditar={empleadoEditar}
          manejoCambioInputEdicion={manejoCambioInputEdicion}
          actualizarEmpleado={actualizarEmpleado}
        />

        <ModalEliminacionEmpleado
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarEmpleado={eliminarEmpleado}
          empleado={empleadoAEliminar}
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

export default Empleados;
