<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Deal;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

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

    public function createDeal(Request $request)
    {
        try {
            // Validate incoming request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'quantity' => 'required|integer|min:1',
                'unit_price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'product_ids' => 'required|array',
                'product_ids.*' => 'exists:products,id',
                'isAvailable' => 'nullable|boolean',
                'image' => 'required|image|max:2048',
                'discount_ids' => 'nullable|array',
                'discount_ids.*' => 'exists:discounts,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = $image->getClientOriginalName();
                $imagePath = $image->storeAs('deals', $imageName, 'public');
                $imageUrl = Storage::url($imagePath);
            } else {
                return response()->json(['error' => 'Image file is required.'], 422);
            }

            // Create new deal
            $deal = new Deal;
            $deal->name = $request->input('name');
            $deal->description = $request->input('description');
            $deal->quantity = $request->input('quantity');
            $deal->unit_price = $request->input('unit_price');
            //$deal->category_id = $request->input('category_id');
            $deal->isAvailable = $request->input('isAvailable', false);
            $deal->image = $imageUrl;

            // Initialize current price
            $currentPrice = $deal->unit_price;

            $deal->save();

            // Attach products to the deal
            $deal->products()->attach($request->input('product_ids'));

            // Attach discounts to the deal
            if ($request->has('discount_ids')) {
                $discountIds = $request->input('discount_ids');

                foreach ($discountIds as $discountId) {
                    $discount = Discount::find($discountId);

                    // Check if deal already has a discount
                    $existingDiscount = DB::table('discount_deals')
                        ->where('deal_id', $deal->id)
                        ->first();

                    if ($existingDiscount) {
                        $previousPrice = $existingDiscount->current_price;
                    } else {
                        $previousPrice = $deal->unit_price;
                    }

                    // Calculate discount amount and current price
                    if ($discount->type == 'fixed') {
                        $discountAmount = $discount->value;
                    } elseif ($discount->type == 'percentage') {
                        $discountAmount = $previousPrice * ($discount->value / 100);
                    }

                    $currentPrice = $previousPrice - $discountAmount;

                    // Insert into discount_deals table
                    DB::table('discount_deals')->insert([
                        'deal_id' => $deal->id,
                        'discount_id' => $discountId,
                        'discount_amount' => $discountAmount,
                        'previous_price' => $previousPrice,
                        'current_price' => $currentPrice,
                    ]);
                }

                // Update deal with the final current price
                $deal->current_price = $currentPrice;
                $deal->save();
            } else {
                // No discounts, set current price equal to unit price
                $deal->current_price = $deal->unit_price;
                $deal->save();
            }

            return response()->json(['message' => 'Deal created successfully', 'deal' => $deal], 201);
        } catch (\Exception $e) {
            Log::error('Error creating deal: ' . $e->getMessage());

            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


}
