<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CategoryController extends Controller
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
                'errors' => $validator->errors(),
            ]);

            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create the new category
            $category = Category::create([
                'name' => $request->name,
            ]);

            Log::info('Category created successfully', [
                'category' => $category,
            ]);

            return response()->json(['message' => 'Category created successfully'], 201);

        } catch (\Exception $e) {
            Log::error('Error creating category', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    public function editCategory($id)
    {
        $category = Category::findOrFail($id);
        $authUser = auth()->guard('web')->user();

        Log::info('Authenticated User Data: ', ['authUser' => $authUser]);

        return Inertia::render('Products/category_edit', [
            'category' => $category,
            'auth' => $authUser,
        ]);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        // Validate the request data (you may customize the validation rules as needed)
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',

        ]);

        $category->name = $validatedData['name'];

        $category->save();

        // Return a success response
        return response()->json(['message' => 'The category updated successfully', 'category' => $category]);
    }

    public function destroyCategory($id)
    {
        $category = Category::find($id);

        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        try {
            $category->delete();

            return response()->json(['message' => 'Category deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete category'], 500);
        }
    }

    public function deleteMultiple(Request $request)
    {
        $categoryIds = $request->input('category_ids');

        if (is_array($categoryIds) && count($categoryIds) > 0) {
            Category::whereIn('id', $categoryIds)->delete();

            return response()->json(['message' => 'Categories deleted successfully']);
        }

        return response()->json(['message' => 'No categories selected'], 400);
    }
}
