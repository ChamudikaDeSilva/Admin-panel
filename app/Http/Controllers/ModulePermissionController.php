<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\ModulePermission;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModulePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::all();

        return Inertia::render('Admin/module_permission', [
            'roles' => $roles,
        ]);
    }

    public function modulePermissionIndex()
    {
        $roles = Role::all();
        $modules=Module::all();
        $permissions=Permission::all();

        return response()->json([
            'roles' => $roles,
            'modules' => $modules,
            'permissions'=>$permissions,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->only(['role_id','module_id','permission_id','name']);

        ModulePermission::create($data);

        return response()->json(['message' => 'Permission added Successfully!'],200);
    }

    public function destroy(Request $request)
    {
        $data = $request->only(['role_id', 'module_id', 'permission_id']);

        ModulePermission::where('role_id', $data['role_id'])
            ->where('module_id', $data['module_id'])
            ->where('permission_id', $data['permission_id'])
            ->delete();

        return response()->json(['message' => 'Permission removed successfully!'], 200);
    }

    public function fetchModulePermissions($roleId)
    {
        $permissions = ModulePermission::where('role_id', $roleId)->get();
        return response()->json($permissions);
    }
}
