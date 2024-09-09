<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Deal;
use App\Models\Discount;
use App\Models\Product;
use Inertia\Inertia;

class DealController extends Controller
{
    public function dealIndex()
    {
        $deals = Deal::all();

        return Inertia::render('Products/deals', [
            'deals' => $deals,
        ]);
    }

    public function fetchDeals()
    {
        $deals=Deal::all();
        $products = Product::all();
        $categories = Category::all();
        $discounts = Discount::all();

        return response()->json(['deals'=> $deals,'products' => $products, 'categories' => $categories, 'discounts' => $discounts]);
    }
}
