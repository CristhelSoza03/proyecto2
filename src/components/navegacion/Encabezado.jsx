import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";
import logo from "../../assets/logo.png";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la ruta actual

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("usuario-supabase");
      setMostrarMenu(false);
      navigate("/login");
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
    }
  };

  // Detectar rutas especiales
  const esLogin = location.pathname === "/login";
  const esCatalogo =
    location.pathname === "/catalogo" &&
    localStorage.getItem("usuario-supabase") === null;

  // Contenido del menú
  let contenidoMenu;

  if (esLogin) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion("/login")}
          className={mostrarMenu ? "color-texto-marca" : "text-dark"}
        >
          <i className="bi bi-person-fill-lock me-2"></i>
          Iniciar sesión
        </Nav.Link>
      </Nav>
    );
  } else {
    if (esCatalogo) {
      contenidoMenu = (
        <Nav className="ms-auto pe-2">
          <Nav.Link
            onClick={() => manejarNavegacion("/catalogo")}
            className={mostrarMenu ? "color-texto-marca" : "text-dark"}
          >
            <i className="bi bi-images me-2"></i>
            <strong>Catálogo</strong>
          </Nav.Link>
        </Nav>
      );
    } else {
      contenidoMenu = (
        <>
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              onClick={() => manejarNavegacion("/")}
              className="px-3"
            >
              Inicio
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/categorias")}
              className="px-3"
            >
              Categorías
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/productos")}
              className="px-3"
            >
              Productos
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/catalogo")}
              className="px-3"
            >
              Catálogo
            </Nav.Link>

            <Nav.Link
              onClick={cerrarSesion}
              className="ps-3"
            >
              <i className="bi-box-arrow-right"></i>
            </Nav.Link>
          </Nav>

          {/* Información de usuario en móvil */}
          {mostrarMenu && (
            <div className="mt-3 p-3 rounded bg-light text-dark d-md-none">
              <p className="mb-2 small">
                <i className="bi-person-circle me-2"></i>
                {localStorage.getItem("usuario-supabase")?.toLowerCase() || "Usuario"}
              </p>
              <button
                className="btn btn-sm btn-outline-danger w-100"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </>
      );
    }
  }

  return (
    <Navbar expand="md" fixed="top" className="color-navbar py-2" variant="light" style={{ zIndex: 1050 }}>
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion("/")}
          className="text-dark d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img
            alt="Logo"
            src={logo}
            width="35"
            height="35"
            className="d-inline-block me-2"
          />
          <span className="fs-5">Discosa</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="menu-offcanvas"
          onClick={manejarToggle}
          className="border-0"
        />

        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-md-flex">
          {contenidoMenu}
        </Navbar.Collapse>

        <Navbar.Offcanvas
          id="menu-offcanvas"
          className="d-md-none"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {contenidoMenu}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;