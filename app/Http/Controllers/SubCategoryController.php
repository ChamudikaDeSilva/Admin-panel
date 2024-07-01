<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
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

    public function editSubCategory(SubCategory $subcategory)
    {
        $categories = Category::all();

        return Inertia::render('Products/sub_category_edit', [
            'subcategory' => $subcategory,
            'categories' => $categories,
            'auth' => auth()->user()
        ]);
    }



    public function updateSubCategory(Request $request, SubCategory $subcategory)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $subcategory->update([
            'name' => $request->name,
            'category_id' => $request->category_id,
        ]);

        return response()->json(['message' => 'Subcategory updated successfully']);
    }

    public function destroySubCategory(SubCategory $subcategory)
    {
        $subcategory->delete();
        return response()->json(['message' => 'Subcategory deleted successfully']);
    }

    public function deleteMultiple(Request $request)
    {
        $subcategoryIds = $request->input('subcategory_ids');

        if (is_array($subcategoryIds) && count($subcategoryIds) > 0) {
            SubCategory::whereIn('id', $subcategoryIds)->delete();
            return response()->json(['message' => 'Sub Categories deleted successfully']);
        }

        return response()->json(['message' => 'No sub categories selected'], 400);
    }
}
