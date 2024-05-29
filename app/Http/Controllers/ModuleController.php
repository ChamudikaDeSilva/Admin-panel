<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class ModuleController extends Controller
{
    public function index(Module $module)
    {
        $modules = Module::all();

        $this->authorize('view', $module);


        return Inertia::render('Security/module', [
            'modules' => $modules,
        ]);
    }

    public function moduleIndex()
    {
        $modules = Module::all();
        return response()->json(['modules' => $modules]);
    }

    public function store(Request $request, Module $module)
    {
        try
        {
            //$this->authorize('create', $module);

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $module = new Module();
            $module->name = $validatedData['name'];



            $module->save();

            //Log::info('Module created successfully.', ['module_id' => $module->id]);
            return response()->json($module, 201);
        }
        catch (\Exception $e)
        {
            Log::error('Error adding module: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function destroy($id)
    {
        try{
            $module =Module::findOrFail($id);
            $module->delete();
            return response()->json(['message'=>'Module deleted successfully']);
        }
        catch (\Exception $e)
        {
            Log::error('Error deleting module: '. $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

}
