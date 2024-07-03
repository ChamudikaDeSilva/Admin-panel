<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

}
