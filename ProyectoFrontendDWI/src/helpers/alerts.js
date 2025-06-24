import Swal from 'sweetalert2';

export const showSuccess = (title = 'Éxito', text = '') => {
    Swal.fire({
        icon: 'success',
        title,
        text,
        timer: 2000,
        showConfirmButton: false,
    });
};

export const showError = (title = 'Error', text = '') => {
    Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'Aceptar',
    });
};

export const confirmDelete = async (itemName = 'elemento') => {
    const result = await Swal.fire({
        title: `¿Eliminar ${itemName}?`,
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
};
