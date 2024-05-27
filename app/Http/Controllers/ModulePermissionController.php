<?php

namespace App\Http\Controllers;

use App\Models\Module;
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
}
