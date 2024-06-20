<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProductManagementController extends Controller
{
    public function categoryIndex()
    {
        $categories = Category::all();

        return Inertia::render('Products/category', [
            'categories' => $categories,
        ]);
    }

    public function fetchCategories()
    {
        $categories = Category::all();
        return response()->json(['categories' => $categories]);
    }


    public function createCategory(Request $request)
{
    // Validate the request
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
    ]);

    if ($validator->fails()) {
        Log::error('Validation failed for createCategory', [
            'errors' => $validator->errors()
        ]);
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        // Create the new category
        $category = Category::create([
            'name' => $request->name,
        ]);

        Log::info('Category created successfully', [
            'category' => $category
        ]);

        return response()->json(['message' => 'Category created successfully'], 201);

    } catch (\Exception $e) {
        Log::error('Error creating category', [
            'exception' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json(['message' => 'Internal Server Error'], 500);
    }
}

}
