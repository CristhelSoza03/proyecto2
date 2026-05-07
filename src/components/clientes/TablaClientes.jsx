import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre Completo</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id_cliente}>
              <td>{c.nombre}</td>
              <td>{c.correo || "N/A"}</td>
              <td>{c.telefono || "N/A"}</td>
              <td className="text-center">
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(c)}
                >
                  <i className="bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(c)}
                >
                  <i className="bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaClientes;
