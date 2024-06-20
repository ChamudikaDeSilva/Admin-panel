<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProductManagementController extends Controller
{
//--------------------------------Category-------------------------------------------------------------------------------
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

    public function editCategory($id)
    {
        $category = Category::findOrFail($id);
        $authUser = auth()->user();

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

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        try {
            $category->delete();
            return response()->json(['message' => 'Category deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete category'], 500);
        }
    }

//--------------------------------Sub Category-------------------------------------------------------------------------------
    public function subcategoryIndex()
    {
        $subcategories = SubCategory::all();

        return Inertia::render('Products/sub_category', [
            'subcategories' => $subcategories,
        ]);
    }

    public function fetchSubCategories()
    {
        $subcategories = SubCategory::with('category')->get();
        return response()->json(['subcategories' => $subcategories]);
    }


    public function createSubCategory(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed for createSubCategory', [
                'errors' => $validator->errors()
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create the new subcategory
            $subcategory = SubCategory::create([
                'name' => $request->name,
                'category_id' => $request->category_id,
            ]);

            Log::info('SubCategory created successfully', [
                'subcategory' => $subcategory
            ]);

            return response()->json(['message' => 'SubCategory created successfully', 'subcategory' => $subcategory], 201);

        } catch (\Exception $e) {
            Log::error('Error creating subcategory', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }


}