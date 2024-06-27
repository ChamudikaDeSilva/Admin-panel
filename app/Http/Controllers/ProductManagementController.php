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
use Illuminate\Support\Str;

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
        $categories=Category::all();
        $subcategories=SubCategory::all();

        return response()->json(['products' => $products,'categories'=>$categories,'subcategories'=>$subcategories]);
    }




    public function createProduct(Request $request)
    {
        try {
            // Validate incoming request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'quantity' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id', // Ensure category exists
                'subcategory_id' => 'nullable|exists:sub_categories,id', // Subcategory is optional
                'isAvailable' => 'nullable|boolean',
                'image' => 'required|image|max:2048', // Image is required and must be an image file (max 2MB)
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = $image->getClientOriginalName(); // Consider using a unique name to avoid conflicts
                $imagePath = $image->storeAs('products', $imageName, 'public'); // Store image in storage/app/public/products
                $imageUrl = Storage::url($imagePath); // Generate URL for the stored image
            } else {
                return response()->json(['error' => 'Image file is required.'], 422);
            }

            // Generate unique slug based on product name
            $slug = Str::slug($request->input('name'), '-');
            $slug = $this->makeUniqueSlug($slug);

            // Create new product
            $product = new Product();
            $product->name = $request->input('name');
            $product->description = $request->input('description');
            $product->quantity = $request->input('quantity');
            $product->price = $request->input('price');
            $product->category_id = $request->input('category_id');
            $product->sub_category_id = $request->input('subcategory_id');
            $product->isAvailable = $request->input('isAvailable', false);
            $product->image = $imageUrl; // Save the URL of the image
            $product->slug = $slug;

            // Save product
            $product->save();

            return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Error creating product: ' . $e->getMessage());

            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


    /**
     * Helper function to make slug unique if already exists.
     *
     * @param string $slug
     * @return string
     */
    private function makeUniqueSlug($slug)
    {
        $originalSlug = $slug;
        $count = 1;

        // Check if slug already exists in database
        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    /*public function editProduct(Product $product)
    {
        // Load the categories and subcategories
        $categories = Category::all();
        $subcategories = SubCategory::all();
        $user = auth()->user();

        // Ensure the image URL is correct
        $imageUrl = $product->image ? url($product->image) : null;

        // Pass the necessary data to the frontend
        return Inertia::render('Products/product_edit', [
            'product' => array_merge($product->toArray(), ['image' => $imageUrl]), //Pass the image url to frontend
            'categories' => $categories,
            'subcategories' => $subcategories,
            'auth' => $user,
        ]);
    }*/

    public function editProduct(Product $product)
    {
        // Load the categories and subcategories
        $categories = Category::all();
        $subcategories = SubCategory::all();
        $user = auth()->user();

        // Ensure the image URL is correct
        //$imageUrl = $product->image ? url($product->image) : null;

        // Pass the necessary data to the frontend
        return Inertia::render('Products/product_edit', [
            'product' => $product,
            'categories' => $categories,
            'subcategories' => $subcategories,
            'auth' => $user,
        ]);
    }


    public function updateProduct(Request $request, Product $product)
    {
        try {
            // Log the incoming request data for debugging
            Log::info('Update product request data: ', $request->all());

            // Validation rules
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'quantity' => 'sometimes|required|integer|min:1',
                'price' => 'sometimes|required|numeric|min:0',
                'category_id' => 'sometimes|required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:sub_categories,id',
                'isAvailable' => 'nullable|boolean',
                'image' => 'nullable|image|max:2048',
            ];

            // Validate incoming request data
            $validator = Validator::make($request->all(), $rules);

            // Log any validation errors
            if ($validator->fails()) {
                Log::error('Validation errors: ', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete previous image if it exists
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }

                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName(); // Unique name generation
                $imagePath = $image->storeAs('products', $imageName, 'public'); // Store image in storage/app/public/products
                $product->image = $imagePath; // Save image path
            }

            // Merge existing product data with the request data
            $product->fill($request->only([
                'name', 'description', 'quantity', 'price', 'category_id', 'subcategory_id', 'isAvailable'
            ]));

            // Save updated product
            $product->save();

            return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Error updating product: ' . $e->getMessage());

            // Return error response
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }




    public function destroyProduct(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }


}
