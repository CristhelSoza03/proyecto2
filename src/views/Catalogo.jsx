import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        const [resProductos, resCategorias] = await Promise.all([
          supabase.from("productos").select("*"),
          supabase.from("categorias").select("*").order("nombre", { ascending: true })
        ]);

        if (resProductos.error) throw resProductos.error;
        if (resCategorias.error) throw resCategorias.error;

        // Mapear categorías para asegurar que id_categoria y nombre_categoria existan (compatibilidad)
        const categoriasMapeadas = (resCategorias.data || []).map(cat => ({
          ...cat,
          id_categoria: cat.id_categoria || cat.id,
          nombre_categoria: cat.nombre || cat.nombre_categoria
        }));

        setProductos(resProductos.data || []);
        setCategorias(categoriasMapeadas);
      } catch (err) {
        console.error("Error al cargar el catálogo:", err.message);
        setError("No se pudo cargar la información.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Imagen 10: Variable para la manipulación de las categorías filtradas
  const productosFiltrados = useMemo(() => {
    let filtrados = productos;

    if (categoriaSeleccionada !== "todas") {
      filtrados = filtrados.filter(
        (prod) => prod.categoria_producto === parseInt(categoriaSeleccionada)
      );
    }

    if (textoBusqueda.trim()) {
      const textoLower = textoBusqueda.toLowerCase().trim();

      filtrados = filtrados.filter((prod) => {
        const nombre = prod.nombre_producto?.toLowerCase() || "";
        const descripcion = prod.descripcion_producto?.toLowerCase() || "";
        const precioTexto = prod.precio_venta?.toString() || "";

        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precioTexto.includes(textoLower)
        );
      });
    }

    return filtrados;
  }, [productos, categoriaSeleccionada, textoBusqueda]);

  // Imagen 11: Métodos de manejo de variables de estados
  const manejarCambioCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // Obtener nombre de categoría
  const obtenerNombreCategoria = (idCategoria) => {
    const cat = categorias.find((c) => c.id_categoria === idCategoria);
    return cat ? cat.nombre_categoria : "Sin categoría";
  };

  return (
    <div className="bg-secondary-subtle min-vh-100">
      <Container className="mt-3 px-1">
        {/* Imagen 3ra captura: Estructura del retorno */}
        <Row className="text-center mb-1">
          <Col>
            <p className="lead text-muted">
              Nuestros productos por categoria
            </p>
          </Col>
        </Row>

        <Row className="mb-1 align-items-end">
          <Col md={4} lg={3} className="mb-2">
            <Form.Group controlId="filtroCategoria">
              <Form.Select
                value={categoriaSeleccionada}
                onChange={manejarCambioCategoria}
                className="shadow-sm"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6} lg={5} className="mb-2">
            <Form.Group controlId="busquedaProducto">
              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarCambioBusqueda}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Estados */}
        {cargando && (
          <Row className="text-center my-5">
            <Col>
              <Spinner animation="border" variant="success" size="lg" />
              <p className="mt-3 text-muted">Cargando productos...</p>
            </Col>
          </Row>
        )}

        {!cargando && productosFiltrados.length === 0 && (
          <Alert variant="info" className="text-center">
            <i className="bi bi-info-circle me-2"></i>
            No se encontraron productos que coincidan con tu búsqueda.
          </Alert>
        )}

        {/* Productos */}
        {!cargando && productosFiltrados.length > 0 && (
          <Row className="g-3">
            {productosFiltrados.map((producto) => (
              <Col xs={6} sm={6} md={4} lg={3} key={producto.id_producto}>
                <TarjetaCatalogo
                  producto={producto}
                  categoriaNombre={obtenerNombreCategoria(producto.categoria_producto)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Catalogo;
