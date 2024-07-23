<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Discount;
use App\Models\DiscountProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class FrontendProductController extends Controller
{
    public function shopIndex()
    {
        // Fetch categories with product counts
        $categories = Category::select('id', 'name')
            ->withCount('products')
            ->get();

        // Fetch price range from products
        $priceRange = Product::select(
            DB::raw('MIN(price) as min_price'),
            DB::raw('MAX(price) as max_price')
        )->first();

        // Fetch discount types from the 'discounts' table enum field 'type'
        $discountTypes = DB::table('discounts')
            ->select('type')
            ->distinct()
            ->get()
            ->pluck('type');

        return response()->json([
            'categories' => $categories,
            'priceRange' => [
                'min' => $priceRange->min_price ?? 0,
                'max' => $priceRange->max_price ?? 0,
            ],
            'discountTypes' => $discountTypes,
        ]);
    }

    public function fetchProducts(Request $request)
    {
        $categoryId = $request->input('category_id');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $discountType = $request->input('discount_type');
        $page = $request->input('page', 1);
        $perPage = 9; // Number of products per page

        $query = Product::query();

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($minPrice !== null && $maxPrice !== null) {
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        }

        if ($discountType) {
            // Fetch discount IDs based on selected discount type
            $discountIds = Discount::where('type', $discountType)->pluck('id');

            // Fetch product IDs associated with the selected discount IDs
            $productIds = DiscountProduct::whereIn('discount_id', $discountIds)->pluck('product_id');

            // Filter products by the fetched product IDs
            $query->whereIn('id', $productIds);
        }

        $products = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($products);
    }




}
