<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryDeal;
use App\Models\Deal;
use App\Models\Discount;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
        try {
            $deals = Deal::with('categorydeals')->get();
        $products = Product::all();
        $categories = Category::all();
        $discounts = Discount::all();


        return response()->json(['deals' => $deals, 'products' => $products, 'categories' => $categories, 'discounts' => $discounts]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }

    public function createDeals(Request $request)
    {
        try {
            // Log incoming request
            Log::info('Creating a new deal', ['request_data' => $request->all()]);

            // Validate the incoming request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'unit_price' => 'required|numeric',
                'quantity' => 'required|integer',
                'category_id' => 'required|integer|exists:categories,id', // category_id validation
                'discounts' => 'nullable|array',
                'discounts.*' => 'integer|exists:discounts,id',
                'isAvailable' => 'required|boolean',
                'image' => 'nullable|image|max:2048', // Validate image (optional)
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed', ['errors' => $validator->errors()]);

                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = $image->getClientOriginalName();
                $imagePath = $image->storeAs('deals', $imageName, 'public');
                $imageUrl = Storage::url($imagePath);
                Log::info('Image uploaded successfully', ['image_url' => $imageUrl]);
            } else {
                Log::error('Image file is required but not provided');

                return response()->json(['error' => 'Image file is required.'], 422);
            }

            // Create deal
            $deal = new Deal;
            $deal->name = $request->input('name');
            $deal->description = $request->input('description');
            $deal->unit_price = $request->input('unit_price');
            $deal->quantity = $request->input('quantity');
            $deal->isAvailable = $request->input('isAvailable');
            $deal->image = $imageUrl;
            $deal->save();
            Log::info('Deal created successfully', ['deal_id' => $deal->id]);

            // Insert category_id and deal_id into category_deals table
            DB::table('category_deals')->insert([
                'category_id' => $request->input('category_id'),
                'deal_id' => $deal->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            Log::info('Category-deal relation saved', ['category_id' => $request->input('category_id'), 'deal_id' => $deal->id]);

            // Handle discounts
            $current_price = $deal->unit_price;
            if ($request->has('discounts')) {
                $discounts = $request->input('discounts');
                foreach ($discounts as $discountId) {
                    $discount = Discount::find($discountId);
                    if (! $discount) {
                        Log::warning('Discount not found', ['discount_id' => $discountId]);

                        continue;
                    }

                    $existingDiscount = DB::table('discount_deals')
                        ->where('deal_id', $deal->id)
                        ->first();

                    $previousPrice = $existingDiscount ? $existingDiscount->current_price : $deal->unit_price;

                    if ($discount->type == 'fixed') {
                        $discountAmount = $discount->value;
                    } elseif ($discount->type == 'percentage') {
                        $discountAmount = $previousPrice * ($discount->value / 100);
                    }

                    $currentPrice = $previousPrice - $discountAmount;

                    DB::table('discount_deals')->insert([
                        'deal_id' => $deal->id,
                        'discount_id' => $discountId,
                        'discount_amount' => $discountAmount,
                        'previous_price' => $previousPrice,
                        'current_price' => $currentPrice,
                    ]);

                    Log::info('Discount applied to deal', [
                        'deal_id' => $deal->id,
                        'discount_id' => $discountId,
                        'discount_amount' => $discountAmount,
                        'current_price' => $currentPrice,
                    ]);
                }

                $deal->current_price = $currentPrice;
                $deal->save();
            } else {
                $deal->current_price = $deal->unit_price;
                $deal->save();
                Log::info('No discounts applied, current price set to unit price', ['deal_id' => $deal->id]);
            }

            return response()->json([
                'message' => 'Deal created successfully!',
                'deal' => $deal,
            ], 201);
        } catch (Exception $e) {
            Log::error('Error creating deal', ['exception' => $e->getMessage()]);

            return response()->json(['error' => 'An error occurred while creating the deal. Please try again.'], 500);
        }
    }

    public function assignProducts()
    {
        
    }
}
