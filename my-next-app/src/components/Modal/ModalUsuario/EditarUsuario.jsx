"use client";

import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { ROLES } from "@/config/permissions";
import { X } from "lucide-react";
import notyf from "@/utils/notificacion";

function ModalEditarUsuario({ isOpen, onRequestClose, usuario, notificacion }) {
    if (!usuario) return null;

    const [editing, setEditing] = useState(false);
    const [rolesDis, setRolesDis] = useState([]);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (usuario?.role) {
            setRolesDis(Object.values(ROLES).filter((role) => role !== usuario.role));
        } else {
            setRolesDis([]);
        }
    }, [usuario]);

    const EditarLugar = async () => {
        if (!role) return notyf.error("Seleccione un rol");
        if (editing) return;

        try {
            setEditing(true);
            const resul = await fetch("/api/Usuarios", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuarioId: usuario._id, role: role }),
            });

            onRequestClose();
            setTimeout(() => {
                resul.status === 200
                    ? notificacion(200, { _id: usuario._id, role: role })
                    : notificacion(400);
            }, 100);
        } catch (error) {
            console.error("Error al editar usuario:", error);
            onRequestClose();
            notificacion(400);
        } finally {
            setEditing(false);
            setRole("");
        }
    };

    return (
        <Modal open={isOpen} onClose={() => { setRole(""); onRequestClose(); }} disablePortal
        closeAfterTransition>
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
                            disabled={editing}
                            onClick={onRequestClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar usuario</h3>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <input
                            type="email"
                            value={usuario.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed bg-gray-100"
                        />

                        <select
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            defaultValue=""
                        >
                            <option value="" disabled>Seleccione un rol</option>
                            {rolesDis.map((r, index) => (
                                <option key={index} value={r}>{r}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => EditarLugar()}
                            type="submit"
                            disabled={editing}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors focus:outline-none 
                                ${editing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {editing ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default ModalEditarUsuario;
