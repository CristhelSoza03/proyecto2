import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const CuadroBusquedas = ({ busqueda, setBusqueda }) => {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text id="search-icon">
        <i className="bi-search"></i>
      </InputGroup.Text>
      <Form.Control
        placeholder="Buscar productos por nombre..."
        aria-label="Buscar"
        aria-describedby="search-icon"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;