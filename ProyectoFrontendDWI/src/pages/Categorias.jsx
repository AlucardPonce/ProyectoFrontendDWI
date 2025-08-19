import { useEffect, useState } from "react";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    nombreCategoria: "",
    categoriaFederal: false,
    categoriaEstatal: false
  });

  const apiUrl = "http://20.119.81.0:8082/api/categorias";

  const fetchCategorias = () => {
    setLoading(true);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener categorías");
        return res.json();
      })
      .then((data) => {
        setCategorias(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `${apiUrl}/${form.id}` : apiUrl;

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombreCategoria: form.nombreCategoria,
        categoriaFederal: form.categoriaFederal,
        categoriaEstatal: form.categoriaEstatal
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        setForm({
          id: null,
          nombreCategoria: "",
          categoriaFederal: false,
          categoriaEstatal: false
        });
        fetchCategorias();
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (categoria) => {
    setForm({
      id: categoria.id,
      nombreCategoria: categoria.nombreCategoria,
      categoriaFederal: categoria.categoriaFederal,
      categoriaEstatal: categoria.categoriaEstatal
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al eliminar");
          fetchCategorias();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <h2>Categorías</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="nombreCategoria"
          placeholder="Nombre de la categoría"
          value={form.nombreCategoria}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="categoriaFederal"
            checked={form.categoriaFederal}
            onChange={handleChange}
          />
          Federal
        </label>
        <label>
          <input
            type="checkbox"
            name="categoriaEstatal"
            checked={form.categoriaEstatal}
            onChange={handleChange}
          />
          Estatal
        </label>
        <button type="submit">{form.id ? "Actualizar" : "Crear"}</button>
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <strong>Nombre:</strong> {categoria.nombreCategoria} <br />
              <strong>Federal:</strong>{" "}
              {categoria.categoriaFederal ? "Sí" : "No"} <br />
              <strong>Estatal:</strong>{" "}
              {categoria.categoriaEstatal ? "Sí" : "No"} <br />
              <button onClick={() => handleEdit(categoria)}>Editar</button>
              <button onClick={() => handleDelete(categoria.id)}>
                Eliminar
              </button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categorias;
