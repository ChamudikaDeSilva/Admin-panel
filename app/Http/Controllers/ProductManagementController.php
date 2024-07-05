<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Discount;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductManagementController extends Controller
{

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
        $discounts=Discount::all();

        return response()->json(['products' => $products,'categories'=>$categories,'subcategories'=>$subcategories, 'discounts'=>$discounts	]);
    }


    public function createProduct(Request $request)
    {
        try {
            Log::info('create product request data: ', $request->all());

            // Validate incoming request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'quantity' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:sub_categories,id',
                'isAvailable' => 'nullable|boolean',
                'image' => 'required|image|max:2048',
                'discounts' => 'nullable|array', // Validate discounts as an array
                'discounts.*' => 'exists:discounts,id', // Validate each discount ID exists in the discounts table
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
            $product->image = $imageUrl;
            $product->slug = $slug;

            $product->save();

            // Attach discounts to the product
            if ($request->has('discounts')) {
                $discounts = $request->input('discounts');
                foreach ($discounts as $discountId) {
                    DB::table('discount_products')->insert([
                        'product_id' => $product->id,
                        'discount_id' => $discountId,
                    ]);
                }
            }

            return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
        } catch (\Exception $e) {
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

    public function updateProduct(Request $request, $productId)
    {
        // Log incoming request data
        Log::info('Received request data:', ['request' => $request->all()]);

        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'subcategory_id' => 'nullable|integer|exists:sub_categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:0',
            'availability' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', ['errors' => $validator->errors()]);
            return response()->json($validator->errors(), 422);
        }

        try {
            $product = Product::findOrFail($productId);

            // Update product details (except image)
            $product->update([
                'name' => $request->name,
                'category_id' => $request->category_id,
                'sub_category_id' => $request->subcategory_id,
                'description' => $request->description,
                'price' => $request->price,
                'quantity' => $request->quantity,
                'isAvailable' => $request->availability,
            ]);

            // Handle image upload (if provided)
            if ($request->hasFile('image')) {
                // Remove existing image if present
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }

                $image = $request->file('image');
                $imageName = $image->getClientOriginalName();
                $imagePath = $image->storeAs('products', $imageName, 'public');
                $imageUrl = Storage::url($imagePath);

                $product->image = $imageUrl;
            }

            $product->save();

            return response()->json(['message' => 'Product updated successfully', 'product' => $product], 201);
        }
        catch (\Exception $e) {
            Log::error('Error updating product:', [
                'exception' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }


    public function destroyProduct(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function deleteMultiple(Request $request)
    {
        $productIds = $request->input('product_ids');

        if (is_array($productIds) && count($productIds) > 0) {
            Product::whereIn('id', $productIds)->delete();
            return response()->json(['message' => 'Products deleted successfully']);
        }

        return response()->json(['message' => 'No products selected'], 400);
    }


}
