import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("*, categorias(nombre_categoria)");

        if (error) throw error;
        setProductos(data);
      } catch (err) {
        console.error("Error al obtener productos:", err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="mt-3">
      <Row className="mb-4">
        <Col>
          <h2><i className="bi-images me-2"></i> Nuestro Catálogo</h2>
          <CuadroBusquedas 
            textoBusqueda={busqueda} 
            manejarCambioBusqueda={(e) => setBusqueda(e.target.value)} 
          />
        </Col>
      </Row>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p) => (
              <Col key={p.id}>
                <TarjetaCatalogo producto={p} />
              </Col>
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Catalogo;