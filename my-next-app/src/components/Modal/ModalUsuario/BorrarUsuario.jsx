"use client"

import { useState } from "react";
import { Modal, Box } from "@mui/material"
import { X, CheckCircle, XCircle } from "lucide-react";

function ModalBorrarUsuario ({ isOpen,onRequestClose, usuario, notificacion }) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!usuario) return null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '400px',
        p: 4,
        borderRadius: "16px"
    };

    const eliminarEmpleado = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/Usuarios?usuarioId=${usuario._id}`, {
                method: "DELETE"
            });

            onRequestClose();
            setTimeout(() => {
                if (response.status === 200) {
                    notificacion(200);
                } else {
                    notificacion(400);
                }
                setIsDeleting(false);
            }, 100);

        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            onRequestClose();
            notificacion(400);
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            disablePortal
            closeAfterTransition
        >
            <Box sx={style}>
                <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={onRequestClose}
                            disabled={isDeleting}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center">

                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            ¿Estás seguro de eliminar a <b>{usuario.user}</b>?
                        </h3>

                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={eliminarEmpleado}
                                disabled={isDeleting}
                                className={`
            flex items-center justify-center
            w-32 py-2 px-4 
            bg-emerald-600 text-white 
            rounded-lg font-medium 
            transition-colors focus:outline-none duration-300
            whitespace-nowrap
            ${!isDeleting
                                        ? 'hover:bg-emerald-700 '
                                        : 'opacity-50 cursor-not-allowed'}
        `}
                            >
                                {!isDeleting ? (
                                    <>
                                        <CheckCircle className="mr-2 w-5 h-5" />
                                        Sí, eliminar
                                    </>
                                ) : (
                                    'Eliminando...'
                                )}
                            </button>

                            {!isDeleting && (
                                <button
                                    onClick={onRequestClose}
                                    className={`
                flex items-center justify-center
                w-32 py-2 px-4 
                bg-red-600 text-white 
                rounded-lg font-medium 
                transition-colors focus:outline-none
                whitespace-nowrap
                hover:bg-red-700  duration-300
            `}
                                >
                                    <XCircle className="mr-2 w-5 h-5" />
                                    No, cancelar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalBorrarUsuario;