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

    public function createDeals(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit_price' => 'required|numeric',
            'quantity' => 'required|integer',
            'category_id' => 'required|integer|exists:categories,id',
            'product_ids' => 'required|array',
            'product_ids.*' => 'integer|exists:products,id',
            'discount_ids' => 'nullable|array',
            'discount_ids.*' => 'integer|exists:discounts,id',
            'isAvailable' => 'required|boolean',
            'image' => 'nullable|image|max:2048', // Validate image (optional)
        ]);

        // Create the deal
        $deal = Deal::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'unit_price' => $validated['unit_price'],
            'quantity' => $validated['quantity'],
            'category_id' => $validated['category_id'],
            'isAvailable' => $validated['isAvailable'],
        ]);

        // Associate selected products
        if (isset($validated['product_ids'])) {
            $deal->products()->attach($validated['product_ids']);
        }

        // Associate selected discounts
        if (isset($validated['discount_ids'])) {
            $deal->discounts()->attach($validated['discount_ids']);
        }

        // Handle image upload if exists
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('deal_images', 'public');
            $deal->update(['image' => $imagePath]);
        }

        return response()->json([
            'message' => 'Deal created successfully!',
            'deal' => $deal
        ], 201);
    }
}
