<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Deal;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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

    /*public function createDeals(Request $request)
    {
        try{
            $validator=Validate::make($trquest->all(),[
                'name'=>'required|string|max:255',
                'description'=>'required|string',
                'product_id'=>'required|exists:products,id',
                'category_id'=>'required|exists:categories,id',
                'discount_id'=>'required|exists:discounts,id',
                'start_date'=>'required|date',
            ]);
        }
    }*/
}
