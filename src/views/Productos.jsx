import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TarjetasProductos from "../components/productos/TarjetasProductos";
import Paginacion from "../components/ordenamiento/Paginacion";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    stock: "",
    archivo: null,
  });

  const [productoEditar, setProductoEditar] = useState({
    id_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    stock: "",
    url_imagen: "",
    archivo: null,
  });

  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // Estados para la paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // Método para obtener productos
  const obtenerProductos = async () => {
    try {
      setCargando(true);
      
      // Realizamos peticiones separadas para evitar errores de ambigüedad en la relación de Supabase
      const [productosRes, categoriasRes] = await Promise.all([
        supabase.from("productos").select("*").order("id_producto", { ascending: false }),
        supabase.from("categorias").select("*")
      ]);

      if (productosRes.error) throw productosRes.error;
      if (categoriasRes.error) throw categoriasRes.error;

      // Creamos un mapa de categorías para una búsqueda rápida
      const mapaCategorias = (categoriasRes.data || []).reduce((acc, cat) => {
        acc[cat.id_categoria] = cat;
        return acc;
      }, {});

      // Unimos manualmente los productos con sus categorías en JavaScript
      const datosMapeados = (productosRes.data || []).map(prod => ({
        ...prod,
        categorias: mapaCategorias[prod.categoria_producto] || null
      }));

      setProductos(datosMapeados);
      setProductosFiltrados(datosMapeados);
      setCategorias(categoriasRes.data || []); // Actualizamos también la lista de categorías para el modal

    } catch (err) {
      console.error("Error al obtener productos:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar productos: " + err.message,
        tipo: "error"
      });
    } finally {
      setCargando(false);
    }
  };

  // Imagen 7: Métodos de manejo de variables de estado
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivoActualizar = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setProductoEditar((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  // Imagen 8: Métodos useEffect
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = productos.filter((prod) => {
        const nombre = prod.nombre_producto?.toLowerCase() || "";
        const descripcion = prod.descripcion_producto?.toLowerCase() || "";
        const precio = prod.precio_venta?.toString() || "";
        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
    establecerPaginaActual(1); // Resetear a la primera página al buscar
  }, [textoBusqueda, productos]);

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Imagen 9: Método para carga de categorías
  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });
      if (error) throw error;
      
      // Mapeo robusto de categorías para asegurar que id_categoria siempre exista
      const categoriasMapeadas = (data || []).map(cat => ({
        ...cat,
        id_categoria: cat.id_categoria || cat.id,
        nombre_categoria: cat.nombre_categoria || cat.nombre || "Sin nombre"
      }));
      
      setCategorias(categoriasMapeadas);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  // Imagen 10: Método agregarProducto
  const agregarProducto = async () => {
    try {
      console.log("Iniciando proceso de agregar producto...", nuevoProducto);
      
      if (
        !nuevoProducto.nombre_producto?.trim() ||
        !nuevoProducto.categoria_producto ||
        !nuevoProducto.precio_venta ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios (nombre, categoría, precio e imagen)",
          tipo: "advertencia",
        });
        return;
      }

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);
      const urlPublica = urlData.publicUrl;

      // Insertar usando los nombres exactos de columnas de la imagen de la BD
      const { error } = await supabase.from("productos").insert([
        {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion_producto: nuevoProducto.descripcion_producto || null,
          precio_producto: parseFloat(nuevoProducto.precio_venta),
          stock: parseInt(nuevoProducto.stock) || 0,
          categoria_producto: nuevoProducto.categoria_producto,
          imagen_url: urlPublica,
        },
      ]);

      if (error) {
        console.error("Error en el insert de Supabase:", error);
        throw error;
      }

      setNuevoProducto({
        nombre_producto: "",
        descripcion_producto: "",
        categoria_producto: "",
        precio_venta: "",
        archivo: null,
      });

      setMostrarModal(false); 
      await obtenerProductos();

      setToast({ mostrar: true, mensaje: "Producto registrado correctamente", tipo: "exito" });
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setToast({ 
        mostrar: true, 
        mensaje: "Error de Supabase: " + (err.message || "Error desconocido"), 
        tipo: "error" 
      });
    }
  };

  const actualizarProducto = async () => {
    try {
      if (
        !productoEditar.nombre_producto.trim() ||
        !productoEditar.categoria_producto ||
        !productoEditar.precio_venta
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      let datosActualizados = {
        nombre_producto: productoEditar.nombre_producto,
        descripcion_producto: productoEditar.descripcion_producto || null,
        categoria_producto: productoEditar.categoria_producto,
        precio_producto: parseFloat(productoEditar.precio_venta),
        imagen_url: productoEditar.url_imagen,
        stock: parseInt(productoEditar.stock) || 0,
      };

      if (productoEditar.archivo) {
        const nombreArchivo = `${Date.now()}_${productoEditar.archivo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, productoEditar.archivo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);
        
        datosActualizados.imagen_url = urlData.publicUrl;

        // Eliminar imagen anterior si existía
        if (productoEditar.url_imagen) {
          try {
            const nombreAnterior = productoEditar.url_imagen.split("/").pop().split("?")[0];
            await supabase.storage.from("imagenes_productos").remove([nombreAnterior]);
          } catch (storageErr) {
            console.error("Error al eliminar imagen anterior:", storageErr);
          }
        }
      }

      const { error } = await supabase
        .from("productos")
        .update(datosActualizados)
        .eq("id_producto", productoEditar.id_producto);

      if (error) throw error;

      await obtenerProductos();

      setToast({ mostrar: true, mensaje: "Producto actualizado correctamente", tipo: "exito" });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({ mostrar: true, mensaje: "Error al actualizar producto", tipo: "error" });
    }
  };

  const eliminarProducto = async () => {
    try {
      if (!productoAEliminar) return;

      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", productoAEliminar.id_producto);

      if (error) throw error;

      setToast({ mostrar: true, mensaje: "Producto eliminado", tipo: "exito" });
      setMostrarModalEliminacion(false);
      await obtenerProductos();
    } catch (err) {
      console.error("Error al eliminar:", err);
      setToast({ mostrar: true, mensaje: "Error al eliminar: " + err.message, tipo: "error" });
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      descripcion_producto: producto.descripcion_producto || "",
      categoria_producto: producto.categoria_producto,
      precio_venta: producto.precio_producto,
      stock: producto.stock,
      url_imagen: producto.imagen_url,
      archivo: null,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  return (
    <div className="min-vh-100 bg-secondary-subtle">
      <Container className="profe-page py-4">
        <Row className="align-items-center mb-3">
          <Col xs={8} md={9}>
            <h3 className="profe-page-title mb-0 d-flex align-items-center">
              <i className="bi bi-bag-heart-fill me-3" style={{ fontSize: '1.8rem' }}></i>
              Productos
            </h3>
          </Col>

          <Col xs={4} md={3} className="text-end">
            <Button 
              onClick={() => setMostrarModal(true)} 
              className="profe-add-btn rounded-3 px-3 py-2 shadow-sm text-white"
              style={{ backgroundColor: '#007bff', border: 'none' }}
            >
              <i className="bi bi-plus-lg me-2"></i>
              <span className="d-none d-sm-inline">Nuevo Producto</span>
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
              placeholder="Buscar por nombre, descripción o precio..."
            />
          </Col>
        </Row>

        {/* Renderizado de productos */}
        {cargando ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Cargando productos...</p>
          </div>
        ) : productosFiltrados.length > 0 ? (
          <>
            <TarjetasProductos
              productos={productosPaginados}
              refrescar={obtenerProductos}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
            
            {/* Paginación de productos */}
            <div className="mt-4">
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={productosFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </div>
          </>
        ) : (
          <Alert variant="info" className="text-center">
            <i className="bi bi-info-circle me-2"></i>
            No se encontraron productos que coincidan con la búsqueda.
          </Alert>
        )}

        {/* Modales */}

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejoCambioInput={manejoCambioInput}
          manejoCambioArchivo={manejoCambioArchivo}
          agregarProducto={agregarProducto}
          categorias={categorias}
        />

        <ModalEdicionProducto
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditar={productoEditar}
          manejoCambioInputEdicion={manejoCambioInputEdicion}
          manejoCambioArchivoActualizar={manejoCambioArchivoActualizar}
          actualizarProducto={actualizarProducto}
          categorias={categorias}
        />

        <ModalEliminacionProducto
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProducto={eliminarProducto}
          producto={productoAEliminar}
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

export default Productos;
