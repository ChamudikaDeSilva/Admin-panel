import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Modules({ auth }) {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [modulePermissions, setModulePermissions] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/roles/modules/permissions/get');
            setRoles(response.data.roles);
            setModules(response.data.modules);
            setPermissions(response.data.permissions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchPermissions = async (roleId) => {
        try {
            const response = await axios.get(`/api/module/permissions/${roleId}`);
            const permissionsData = response.data;
            const formattedPermissions = {};

            permissionsData.forEach(permission => {
                if (!formattedPermissions[permission.module_id]) {
                    formattedPermissions[permission.module_id] = {};
                }
                formattedPermissions[permission.module_id][permission.permission_id] = true;
            });

            setModulePermissions(formattedPermissions);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        setSelectedRole(roleId);
        fetchPermissions(roleId);
    };

    const handleCheckboxChange = async (moduleId, permissionId) => {
        if (!selectedRole) {
            alert('Please select a role first.');
            return;
        }

        const isChecked = modulePermissions[moduleId]?.[permissionId] || false;

        setModulePermissions(prevState => ({
            ...prevState,
            [moduleId]: {
                ...prevState[moduleId],
                [permissionId]: !isChecked
            }
        }));

        try {
            if (!isChecked) {
                await axios.post('/api/module/permissions/create', {
                    role_id: selectedRole,
                    module_id: moduleId,
                    permission_id: permissionId,
                    name: `${modules.find(module => module.id === parseInt(moduleId)).name}_${permissions.find(permission => permission.id === parseInt(permissionId)).name}`
                });
            } else {
                await axios.delete(`/api/module/permissions/delete`, {
                    data: {
                        role_id: selectedRole,
                        module_id: moduleId,
                        permission_id: permissionId,
                    }
                });
            }
        } catch (error) {
            console.error('Error updating permissions:', error);
            
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="ModulePermissions" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-12 bg-white border-b border-gray-200">
                            <div className="mb-4 flex items-center">
                                <label htmlFor="role" className="block text-base font-bold text-gray-700 mr-4">
                                    Select Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div><br></br>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-amber-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Modules / Permissions
                                            </th>
                                            {permissions.map((permission) => (
                                                <th key={permission.id} className="px-6 py-3 bg-amber-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {permission.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {modules.map((module) => (
                                            <tr key={module.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {module.name}
                                                </td>
                                                {permissions.map((permission) => (
                                                    <td key={permission.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={modulePermissions[module.id]?.[permission.id] || false}
                                                            onChange={() => handleCheckboxChange(module.id, permission.id)}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
