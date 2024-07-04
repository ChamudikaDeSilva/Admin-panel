<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Discount;
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
        $priceRange = $request->input('price_range');
        $discountType = $request->input('discount_type');
        $page = $request->input('page', 1);
        $perPage = 9; // Number of products per page

        $query = Product::query();

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($priceRange) {
            $query->whereBetween('price', [$priceRange['min'], $priceRange['max']]);
        }

        if ($discountType) {
            $discountIds = Discount::where('type', $discountType)->pluck('id');
            $query->whereHas('discounts', function ($query) use ($discountIds) {
                $query->whereIn('id', $discountIds);
            });
        }

        $products = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($products);
    }


}
