<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

//--------------------------------Product-------------------------------------------------------------------------------

    public function productIndex()
    {
        $products = Product::all();

        return Inertia::render('Products/product', [
            'products' => $products,
        ]);
    }

    public function fetchProducts()
    {
        $products = Product::with(['category', 'subCategory'])->get();
        return response()->json(['products' => $products]);
    }


    public function store(Request $request)
    {
        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id', // Ensure category exists
            'subcategory_id' => 'nullable|exists:subcategories,id', // Subcategory is optional
            'isAvailable' => 'nullable|boolean',
            'image' => 'nullable|image|max:2048', // Max size for image (2MB)
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle image upload if present
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('products', $imageName, 'public'); // Storage path: storage/app/public/products
        }

        // Create new product
        $product = new Product();
        $product->name = $request->input('name');
        $product->description = $request->input('description');
        $product->quantity = $request->input('quantity');
        $product->price = $request->input('price');
        $product->category_id = $request->input('category_id');
        $product->subcategory_id = $request->input('subcategory_id');
        $product->isAvailable = $request->has('isAvailable') ? true : false;
        $product->image = $imagePath; // Store image path in database

        // Save product
        $product->save();

        return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
    }


}
