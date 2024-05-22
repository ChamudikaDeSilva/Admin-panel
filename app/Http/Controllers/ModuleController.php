<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::all();

        return Inertia::render('Admin/module', [
            'modules' => $modules,
        ]);
    }
}
