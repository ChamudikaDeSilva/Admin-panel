<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Discount;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductManagementController extends Controller
{
    public function productIndex()
    {
        $products = Product::all();

        return Inertia::render('Products/product', [
            'products' => $products,
        ]);
    }

    // public function fetchProducts()
    // {
    //     $products = Product::with(['category', 'subCategory'])->get();

    //     // Transform products to include full image URL
    //     $products = $products->map(function ($product) {
    //         return [
    //             'id' => $product->id,
    //             'name' => $product->name,
    //             'description' => $product->description,
    //             'price' => $product->price,
    //             'category' => $product->category,
    //             'subCategory' => $product->subCategory,
    //             'image' => $product->image
    //                 ? asset('storage/products/' . $product->image)
    //                 : null,
    //         ];
    //     });

    //     $categories = Category::all();
    //     $subcategories = SubCategory::all();
    //     $discounts = Discount::all();

    //     return response()->json([
    //         'products' => $products,
    //         'categories' => $categories,
    //         'subcategories' => $subcategories,
    //         'discounts' => $discounts
    //     ]);
    // }

   public function fetchProducts()
    {
        $products = Product::with(['category', 'subCategory'])->get();

        return response()->json([
            'products' => $products,
            'categories' => Category::all(),
            'subcategories' => SubCategory::all(),
            'discounts' => Discount::all(),
        ]);
    }




    // public function createProduct(Request $request)
    // {
    //     try {
    //         // 1. Validate request
    //         $validator = Validator::make($request->all(), [
    //             'name' => 'required|string|max:255',
    //             'description' => 'required|string',
    //             'quantity' => 'required|integer|min:1',
    //             'price' => 'required|numeric|min:0',
    //             'category_id' => 'required|exists:categories,id',
    //             'subcategory_id' => 'nullable|exists:sub_categories,id',
    //             'isAvailable' => 'nullable|boolean',
    //             'image' => 'required|image|max:2048',
    //             'discounts' => 'nullable|array',
    //             'discounts.*' => 'exists:discounts,id',
    //             'unit' => 'required|string',
    //         ]);

    //         if ($validator->fails()) {
    //             return response()->json(['errors' => $validator->errors()], 422);
    //         }

    //         // 2. Handle image upload
    //         $imageName = null;
    //         if ($request->hasFile('image')) {
    //             $image = $request->file('image');
    //             $imageName = time() . '_' . $image->getClientOriginalName();
    //             $image->storeAs('public/products', $imageName);
    //         }

    //         // 3. Generate unique slug
    //         $slug = Str::slug($request->input('name'), '-');
    //         $slug = $this->makeUniqueSlug($slug);

    //         // 4. Create product
    //         $product = new Product;
    //         $product->name = $request->input('name');
    //         $product->description = $request->input('description');
    //         $product->quantity = $request->input('quantity');
    //         $product->unit_price = $request->input('price');
    //         $product->unit = $request->input('unit');
    //         $product->category_id = $request->input('category_id');
    //         $product->sub_category_id = $request->input('subcategory_id');
    //         $product->isAvailable = $request->input('isAvailable', false);
    //         $product->image = $imageName; // Just the filename
    //         $product->slug = $slug;
    //         $product->save();

    //         // 5. Apply discounts if any
    //         $currentPrice = $product->unit_price;

    //         if ($request->has('discounts')) {
    //             $discounts = $request->input('discounts');

    //             foreach ($discounts as $discountId) {
    //                 $discount = Discount::find($discountId);

    //                 $existingDiscount = DB::table('discount_products')
    //                     ->where('product_id', $product->id)
    //                     ->first();

    //                 $previousPrice = $existingDiscount ? $existingDiscount->current_price : $product->unit_price;

    //                 if ($discount->type === 'fixed') {
    //                     $discountAmount = $discount->value;
    //                 } elseif ($discount->type === 'percentage') {
    //                     $discountAmount = $previousPrice * ($discount->value / 100);
    //                 } else {
    //                     $discountAmount = 0;
    //                 }

    //                 $currentPrice = $previousPrice - $discountAmount;

    //                 DB::table('discount_products')->insert([
    //                     'product_id' => $product->id,
    //                     'discount_id' => $discountId,
    //                     'discount_amount' => $discountAmount,
    //                     'previous_price' => $previousPrice,
    //                     'current_price' => $currentPrice,
    //                 ]);
    //             }

    //             $product->current_price = $currentPrice;
    //             $product->save();
    //         } else {
    //             $product->current_price = $product->unit_price;
    //             $product->save();
    //         }

    //         return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);

    //     } catch (\Exception $e) {
    //         Log::error('Error creating product: '.$e->getMessage());
    //         return response()->json(['error' => 'Internal Server Error'], 500);
    //     }
    // }

    public function createProduct(Request $request)
    {
        try {
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
                'discounts' => 'nullable|array',
                'discounts.*' => 'exists:discounts,id',
                'unit' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = $image->getClientOriginalName();
                $imagePath = $image->storeAs('products', $imageName, 'public');
                $imageUrl = Storage::url($imagePath);

            } else {
                return response()->json(['error' => 'Image file is required.'], 422);
            }

            // Generate unique slug
            $slug = Str::slug($request->input('name'), '-');
            $slug = $this->makeUniqueSlug($slug);// Create new product
            $product = new Product;
            $product->name = $request->input('name');
            $product->description = $request->input('description');
            $product->quantity = $request->input('quantity');
            $product->unit_price = $request->input('price');
            $product->unit = $request->input('unit');
            $product->category_id = $request->input('category_id');
            $product->sub_category_id = $request->input('subcategory_id');
            $product->isAvailable = $request->input('isAvailable', false);
            $product->image = $imageUrl;
            $product->slug = $slug;

            // Initialize current price
            $currentPrice = $product->unit_price;

            $product->save();

            // Attach discounts to the product
            if ($request->has('discounts')) {
                $discounts = $request->input('discounts');

                foreach ($discounts as $discountId) {
                    $discount = Discount::find($discountId);

                    // Check if product already has a discount
                    $existingDiscount = DB::table('discount_products')
                        ->where('product_id', $product->id)
                        ->first();

                    if ($existingDiscount) {
                        $previousPrice = $existingDiscount->current_price;
                    } else {
                        $previousPrice = $product->unit_price;
                    }

                    // Calculate discount amount and current price
                    if ($discount->type == 'fixed') {
                        $discountAmount = $discount->value;
                    } elseif ($discount->type == 'percentage') {
                        $discountAmount = $previousPrice * ($discount->value / 100);
                    }

                    $currentPrice = $previousPrice - $discountAmount;

                    // Insert into discount_products table
                    DB::table('discount_products')->insert([
                        'product_id' => $product->id,
                        'discount_id' => $discountId,
                        'discount_amount' => $discountAmount,
                        'previous_price' => $previousPrice,
                        'current_price' => $currentPrice,
                    ]);
                }// Update product with the final current price
                $product->current_price = $currentPrice;
                $product->save();
            } else {
                // No discounts, set current price equal to unit price
                $product->current_price = $product->unit_price;
                $product->save();
            }

            return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
        } catch (\Exception $e) {
            Log::error('Error creating product: '.$e->getMessage());

            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }



    /**
     * Helper function to make slug unique if already exists.
     *
     * @param  string  $slug
     * @return string
     */
    private function makeUniqueSlug($slug)
    {
        $originalSlug = $slug;
        $count = 1;

        // Check if slug already exists in database
        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$count++;
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
        //Log::info('Received request data:', ['request' => $request->all()]);

        // Convert availability to boolean
        $request->merge([
            'availability' => filter_var($request->availability, FILTER_VALIDATE_BOOLEAN),
        ]);

        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'subcategory_id' => 'nullable|integer|exists:sub_categories,id',
            'description' => 'required|string',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:0',
            'availability' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'unit' => 'required|string',
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
                'unit_price' => $request->unit_price,
                'quantity' => $request->quantity,
                'isAvailable' => $request->availability,
                'unit' => $request->unit,
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
        } catch (\Exception $e) {
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
