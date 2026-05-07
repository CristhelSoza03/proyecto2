import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import TablaClientes from "../components/clientes/TablaClientes";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });

  const [clienteEditar, setClienteEditar] = useState({
    id_cliente: "",
    nombre: "",
    correo: "",
    telefono: "",
  });

  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(10);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const obtenerClientes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: false });

      if (error) throw error;
      setClientes(data || []);
      setClientesFiltrados(data || []);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar clientes: " + err.message,
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditar((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = clientes.filter((cli) => {
        const nombre = cli.nombre?.toLowerCase() || "";
        const correo = cli.correo?.toLowerCase() || "";
        const telefono = cli.telefono?.toLowerCase() || "";
        return (
          nombre.includes(textoLower) ||
          correo.includes(textoLower) ||
          telefono.includes(textoLower)
        );
      });
      setClientesFiltrados(filtrados);
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, clientes]);

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  useEffect(() => {
    obtenerClientes();
  }, []);

  const agregarCliente = async () => {
    try {
      if (!nuevoCliente.nombre?.trim()) {
        setToast({
          mostrar: true,
          mensaje: "El nombre es obligatorio",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("clientes").insert([nuevoCliente]);

      if (error) throw error;

      setNuevoCliente({
        nombre: "",
        correo: "",
        telefono: "",
      });

      setMostrarModal(false);
      await obtenerClientes();
      setToast({
        mostrar: true,
        mensaje: "Cliente registrado correctamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al agregar cliente:", err);
      setToast({
        mostrar: true,
        mensaje: "Error: " + err.message,
        tipo: "error",
      });
    }
  };

  const actualizarCliente = async () => {
    try {
      if (!clienteEditar.nombre.trim()) {
        setToast({
          mostrar: true,
          mensaje: "El nombre es obligatorio",
          tipo: "advertencia",
        });
        return;
      }

      const { id_cliente, ...datosAActualizar } = clienteEditar;

      const { error } = await supabase
        .from("clientes")
        .update(datosAActualizar)
        .eq("id_cliente", id_cliente);

      if (error) throw error;

      setMostrarModalEdicion(false);
      await obtenerClientes();
      setToast({
        mostrar: true,
        mensaje: "Cliente actualizado correctamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar cliente",
        tipo: "error",
      });
    }
  };

  const eliminarCliente = async () => {
    try {
      if (!clienteAEliminar) return;

      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cliente", clienteAEliminar.id_cliente);

      if (error) throw error;

      setToast({ mostrar: true, mensaje: "Cliente eliminado", tipo: "exito" });
      setMostrarModalEliminacion(false);
      await obtenerClientes();
    } catch (err) {
      console.error("Error al eliminar:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar: " + err.message,
        tipo: "error",
      });
    }
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditar({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      correo: cliente.correo || "",
      telefono: cliente.telefono || "",
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col xs={8} md={9}>
            <h3 className="profe-page-title mb-0 d-flex align-items-center">
              <i
                className="bi bi-person-lines-fill me-3"
                style={{ fontSize: "1.8rem" }}
              ></i>
              Clientes
            </h3>
          </Col>

          <Col xs={4} md={3} className="text-end">
            <Button
              onClick={() => setMostrarModal(true)}
              className="profe-add-btn rounded-3 px-3 py-2 shadow-sm text-white"
              style={{ backgroundColor: "#007bff", border: "none" }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              <span className="d-none d-sm-inline">Nuevo Cliente</span>
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
              placeholder="Buscar por nombre, correo o teléfono..."
            />
          </Col>
        </Row>

        {cargando ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Cargando clientes...</p>
          </div>
        ) : clientesFiltrados.length > 0 ? (
          <>
            <TablaClientes
              clientes={clientesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />

            <div className="mt-4">
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={clientesFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </div>
          </>
        ) : (
          <Alert variant="info" className="text-center">
            <i className="bi bi-info-circle me-2"></i>
            No se encontraron clientes que coincidan con la búsqueda.
          </Alert>
        )}

        <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoCliente={nuevoCliente}
          manejoCambioInput={manejoCambioInput}
          agregarCliente={agregarCliente}
        />

        <ModalEdicionCliente
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          clienteEditar={clienteEditar}
          manejoCambioInputEdicion={manejoCambioInputEdicion}
          actualizarCliente={actualizarCliente}
        />

        <ModalEliminacionCliente
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarCliente={eliminarCliente}
          cliente={clienteAEliminar}
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

export default Clientes;
