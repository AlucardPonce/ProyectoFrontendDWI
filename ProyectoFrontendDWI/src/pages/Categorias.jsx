import { useEffect, useState } from "react";
import { Trash2, Edit3, Plus, X, Check, AlertCircle } from "lucide-react";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    id: null,
    nombreCategoria: "",
    categoriaFederal: false,
    categoriaEstatal: false
  });

  const apiUrl = "http://localhost:8001/api/categorias";

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

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
        showNotification("Error al cargar las categorías", 'error');
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
    if (e) e.preventDefault();

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
        setShowModal(false);
        fetchCategorias();
        showNotification(
          form.id ? "Categoría actualizada exitosamente" : "Categoría creada exitosamente"
        );
      })
      .catch((err) => {
        console.error(err);
        showNotification("Error al guardar la categoría", 'error');
      });
  };

  const handleEdit = (categoria) => {
    setForm({
      id: categoria.id,
      nombreCategoria: categoria.nombreCategoria,
      categoriaFederal: categoria.categoriaFederal,
      categoriaEstatal: categoria.categoriaEstatal
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    fetch(`${apiUrl}/${deleteId}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        fetchCategorias();
        setShowDeleteModal(false);
        setDeleteId(null);
        showNotification("Categoría eliminada exitosamente");
      })
      .catch((err) => {
        console.error(err);
        showNotification("Error al eliminar la categoría", 'error');
      });
  };

  const openCreateModal = () => {
    setForm({
      id: null,
      nombreCategoria: "",
      categoriaFederal: false,
      categoriaEstatal: false
    });
    setShowModal(true);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '10px',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.9)',
      fontWeight: '300'
    },
    createButton: {
      background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '50px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '30px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(255,107,107,0.4)'
    },
    createButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255,107,107,0.6)'
    },
    notification: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      padding: '15px 20px',
      borderRadius: '10px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '1rem',
      fontWeight: '500',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      animation: 'slideIn 0.3s ease-out'
    },
    notificationSuccess: {
      background: 'linear-gradient(45deg, #00b894, #00a085)'
    },
    notificationError: {
      background: 'linear-gradient(45deg, #e17055, #d63031)'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px'
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(255,255,255,0.3)',
      borderTop: '4px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '25px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px'
    },
    cardTitle: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#2d3436',
      margin: 0,
      maxWidth: '70%',
      wordBreak: 'break-word'
    },
    cardActions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      padding: '8px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    editButton: {
      background: '#e3f2fd',
      color: '#1976d2'
    },
    deleteButton: {
      background: '#ffebee',
      color: '#d32f2f'
    },
    statusContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    statusRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statusLabel: {
      color: '#636e72',
      fontWeight: '500'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600'
    },
    statusActive: {
      background: '#d4edda',
      color: '#155724'
    },
    statusInactive: {
      background: '#f8f9fa',
      color: '#6c757d'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(5px)'
    },
    modalContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'modalSlide 0.3s ease-out'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px'
    },
    modalTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#2d3436',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#636e72',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '5px',
      transition: 'color 0.2s ease'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#2d3436',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#667eea',
      outline: 'none'
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '25px'
    },
    checkboxRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      accentColor: '#667eea'
    },
    checkboxLabel: {
      fontSize: '1rem',
      color: '#2d3436',
      fontWeight: '500'
    },
    modalActions: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px'
    },
    cancelButton: {
      flex: 1,
      padding: '12px 20px',
      border: '2px solid #ddd',
      background: 'white',
      color: '#636e72',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    submitButton: {
      flex: 1,
      padding: '12px 20px',
      border: 'none',
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      borderRadius: '10px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
    },
    deleteModal: {
      textAlign: 'center'
    },
    deleteIcon: {
      width: '60px',
      height: '60px',
      background: '#ffebee',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      color: '#d32f2f'
    },
    deleteTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2d3436',
      marginBottom: '10px'
    },
    deleteMessage: {
      color: '#636e72',
      marginBottom: '25px',
      lineHeight: '1.5'
    },
    deleteButton: {
      background: 'linear-gradient(45deg, #e17055, #d63031)',
      boxShadow: '0 4px 15px rgba(225,112,85,0.4)'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes modalSlide {
            from { transform: scale(0.7); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Gestión de Categorías</h1>
          <p style={styles.subtitle}>Administra las categorías federales y estatales del sistema</p>
        </div>

        {/* Botón Crear */}
        <button
          onClick={openCreateModal}
          style={styles.createButton}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, styles.createButtonHover);
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(255,107,107,0.4)';
          }}
        >
          <Plus size={20} />
          Nueva Categoría
        </button>

        {/* Notificaciones */}
        {notification && (
          <div 
            style={{
              ...styles.notification,
              ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError)
            }}
          >
            {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </div>
        )}

        {/* Lista de Categorías */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        ) : (
          <div style={styles.grid}>
            {categorias.map((categoria) => (
              <div 
                key={categoria.id} 
                style={styles.card}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.cardHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{categoria.nombreCategoria}</h3>
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => handleEdit(categoria)}
                      style={{...styles.actionButton, ...styles.editButton}}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#bbdefb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#e3f2fd';
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
                      style={{...styles.actionButton, ...styles.deleteButton}}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#ffcdd2';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#ffebee';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div style={styles.statusContainer}>
                  <div style={styles.statusRow}>
                    <span style={styles.statusLabel}>Federal:</span>
                    <span style={{
                      ...styles.statusBadge,
                      ...(categoria.categoriaFederal ? styles.statusActive : styles.statusInactive)
                    }}>
                      {categoria.categoriaFederal ? "Sí" : "No"}
                    </span>
                  </div>
                  
                  <div style={styles.statusRow}>
                    <span style={styles.statusLabel}>Estatal:</span>
                    <span style={{
                      ...styles.statusBadge,
                      ...(categoria.categoriaEstatal ? styles.statusActive : styles.statusInactive)
                    }}>
                      {categoria.categoriaEstatal ? "Sí" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Edición/Creación */}
        {showModal && (
          <div style={styles.modal} onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {form.id ? "Editar Categoría" : "Nueva Categoría"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={styles.closeButton}
                  onMouseEnter={(e) => e.target.style.color = '#2d3436'}
                  onMouseLeave={(e) => e.target.style.color = '#636e72'}
                >
                  <X size={24} />
                </button>
              </div>

              <div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    name="nombreCategoria"
                    placeholder="Ingresa el nombre de la categoría"
                    value={form.nombreCategoria}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>

                <div style={styles.checkboxContainer}>
                  <div style={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      name="categoriaFederal"
                      id="categoriaFederal"
                      checked={form.categoriaFederal}
                      onChange={handleChange}
                      style={styles.checkbox}
                    />
                    <label htmlFor="categoriaFederal" style={styles.checkboxLabel}>
                      Categoría Federal
                    </label>
                  </div>

                  <div style={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      name="categoriaEstatal"
                      id="categoriaEstatal"
                      checked={form.categoriaEstatal}
                      onChange={handleChange}
                      style={styles.checkbox}
                    />
                    <label htmlFor="categoriaEstatal" style={styles.checkboxLabel}>
                      Categoría Estatal
                    </label>
                  </div>
                </div>

                <div style={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={styles.cancelButton}
                    onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.background = 'white'}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={styles.submitButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)';
                    }}
                  >
                    {form.id ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteModal && (
          <div style={styles.modal} onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}>
            <div style={{...styles.modalContent, ...styles.deleteModal}}>
              <div style={styles.deleteIcon}>
                <AlertCircle size={30} />
              </div>
              
              <h3 style={styles.deleteTitle}>
                ¿Eliminar Categoría?
              </h3>
              
              <p style={styles.deleteMessage}>
                Esta acción no se puede deshacer. La categoría será eliminada permanentemente del sistema.
              </p>

              <div style={styles.modalActions}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={styles.cancelButton}
                  onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  style={{...styles.submitButton, ...styles.deleteButton}}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(225,112,85,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(225,112,85,0.4)';
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categorias;