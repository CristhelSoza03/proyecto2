import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaEmpleados = ({
  empleados,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre Completo</th>
            <th>Tipo</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((e) => (
            <tr key={e.id_empleado}>
              <td>
                {e.nombre} {e.apellido}
              </td>
              <td>{e.tipo_empleado}</td>
              <td className="text-center">
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(e)}
                >
                  <i className="bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(e)}
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

export default TablaEmpleados;
