"use client"


import { useState } from "react";
import { Modal, Box } from "@mui/material"
import { X } from "lucide-react";
import notyf from "@/utils/notificacion";

function ModalEditarLugar  ({ isOpen, onRequestClose, lugar, notificacion })  {
    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [precio, setPrecio] = useState("");

    if (!lugar) return null;

    const EditarLugar = async () => {
        if (isEditing) return;

        try {
            setIsEditing(true);

            const cambios = {};
            if (nombre && nombre !== lugar.nombre) cambios.nombre = nombre;
            if (direccion && direccion !== lugar.direccion) cambios.direccion = direccion;
            if (precio && precio !== lugar.precio) cambios.precio = precio;

            if (Object.keys(cambios).length === 0) {
                notyf.error("No se realizaron cambios.");
                setIsEditing(false);
                return;
            }

            const resul = await fetch("/api/Lugares", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lugarId: lugar._id, ...cambios }), 
            });

            onRequestClose();
            setTimeout(() => {
                cambios._id=lugar._id;
                if (resul.status === 200) {
                    notificacion(200,cambios);
                } else {
                    notificacion(400);
                }
                setIsEditing(false);
            }, 100);
        } catch (error) {
            console.error("Error al guardar lugar:", error);
            onRequestClose();
            notificacion(400);
            setIsEditing(false);
        } finally {
            setIsEditing(false);
            setDireccion("")
            setNombre("")
            setPrecio("")
        }
    };


    return (
        <Modal 
            open={isOpen} 
            onClose={() => { 
                setDireccion(""); 
                setNombre(""); 
                setPrecio(""); 
                onRequestClose(); 
            }}
            disablePortal
            closeAfterTransition
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: "400px", 
                    p: 4,
                    borderRadius: "12px",
                }}
            >
                <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-end">
                        <button
                            disabled={isEditing}
                            onClick={onRequestClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar lugar</h3>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder={lugar.nombre}
                        />

                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder={lugar.direccion}
                        />

                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => {
                                const num = parseFloat(e.target.value);
                                setPrecio(num > 0 ? num : '');
                            }}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder={`$${lugar.precio}`}
                        />

                        <button
                            onClick={() => EditarLugar()}
                            type="submit"
                            disabled={isEditing}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors focus:outline-none 
                                ${isEditing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {isEditing ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalEditarLugar;