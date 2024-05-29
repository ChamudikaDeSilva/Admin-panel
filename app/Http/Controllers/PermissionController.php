<?php

namespace App\Http\Controllers;


use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions=Permission::all();

        return Inertia::render('Security/permission',[
            'permissions' => $permissions,
        ]);
    }

    public function permissionIndex()
    {
        $permissions=Permission::all();
        return response()->json(['permissions' => $permissions]);
    }

    public function store(Request $request)
    {
        try
        {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $permission = new Permission();
            $permission->name = $validatedData['name'];

            $permission->save();

            return response()->json($permission, 201);
        }
        catch (\Exception $e)
        {
            Log::error('Error adding permission: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function destroy($id)
    {
        try{
            $permission= Permission::findOrFail($id);
            $permission->delete();
            return response()->json(['message'=>'Module deleted successfully']);
        }
        catch (\Exception $e)
        {
            Log::error($e->getMessage());
            return response()->json($e->getMessage(),500);
        }
    }
}
