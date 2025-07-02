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
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'unit_price' => 'required|numeric',
                'quantity' => 'required|integer',
                'category_id' => 'required|integer|exists:categories,id',
                'discount_ids' => 'nullable|array',
                'discount_ids.*' => 'integer|exists:discounts,id',
                'isAvailable' => 'required|boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $imageName = null;

            // Handle image upload (optional)
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $destinationPath = public_path('images/deals');

                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($destinationPath, $imageName);
            }

            // Create the deal
            $deal = new Deal;
            $deal->name = $request->input('name');
            $deal->description = $request->input('description');
            $deal->unit_price = $request->input('unit_price');
            $deal->quantity = $request->input('quantity');
            $deal->isAvailable = $request->input('isAvailable');
            $deal->image = $imageName;
            $deal->save();

            // Add to pivot table: category_deals
            DB::table('category_deals')->insert([
                'category_id' => $request->input('category_id'),
                'deal_id' => $deal->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Handle discounts
            $currentPrice = $deal->unit_price;

            if ($request->has('discount_ids')) {
                $discounts = $request->input('discount_ids');

                foreach ($discounts as $discountId) {
                    $discount = Discount::find($discountId);
                    if (! $discount) {
                        continue;
                    }

                    $previousPrice = $currentPrice;

                    $discountAmount = match ($discount->type) {
                        'fixed' => $discount->value,
                        'percentage' => $previousPrice * ($discount->value / 100),
                        default => 0,
                    };

                    $currentPrice = $previousPrice - $discountAmount;

                    DB::table('discount_deals')->insert([
                        'deal_id' => $deal->id,
                        'discount_id' => $discountId,
                        'discount_amount' => $discountAmount,
                        'previous_price' => $previousPrice,
                        'current_price' => $currentPrice,
                    ]);
                }

                $deal->current_price = $currentPrice;
            } else {
                $deal->current_price = $deal->unit_price;
            }

            $deal->save();

            return response()->json([
                'message' => 'Deal created successfully!',
                'deal' => $deal,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating deal', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while creating the deal. Please try again.'], 500);
        }
    }


    public function editDeal(Deal $deal)
    {
        $categories = Category::all();  // For populating the dropdown
        $products = Product::all();
        $discounts = Discount::all();
        $user = auth()->user();

        // Load both categorydeals and discountdeals relationships
        $deal->load('categorydeals', 'discountdeals');

        return Inertia::render('Products/deal_edit', [
            'products' => $products,
            'categories' => $categories,
            'discounts' => $discounts,
            'auth' => $user,
            'deal' => $deal,
        ]);
    }

    public function updateDeal(Request $request, $dealId)
    {
        try {
            // Normalize isAvailable input to boolean
            $request->merge([
                'isAvailable' => filter_var($request->isAvailable, FILTER_VALIDATE_BOOLEAN),
            ]);

            // Validate request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'unit_price' => 'required|numeric',
                'quantity' => 'required|integer',
                'category_id' => 'required|integer|exists:categories,id',
                'discount_ids' => 'nullable|array',
                'discount_ids.*' => 'integer|exists:discounts,id',
                'isAvailable' => 'required|boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $deal = Deal::findOrFail($dealId);

            // Update basic deal info
            $deal->update([
                'name' => $request->name,
                'description' => $request->description,
                'unit_price' => $request->unit_price,
                'quantity' => $request->quantity,
                'isAvailable' => $request->isAvailable,
            ]);

            // Handle image update (optional)
            if ($request->hasFile('image')) {
                $image = $request->file('image');

                // Delete old image if exists
                if ($deal->image) {
                    $oldImagePath = public_path('images/deals/' . $deal->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                $destinationPath = public_path('images/deals');

                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($destinationPath, $imageName);
                $deal->image = $imageName;
            }

            // Update category association
            DB::table('category_deals')
                ->where('deal_id', $deal->id)
                ->update([
                    'category_id' => $request->category_id,
                    'updated_at' => now(),
                ]);

            // Handle discounts
            $currentPrice = $deal->unit_price;

            // First clear existing discount entries
            DB::table('discount_deals')->where('deal_id', $deal->id)->delete();

            if ($request->has('discount_ids')) {
                $discounts = $request->input('discount_ids');

                foreach ($discounts as $discountId) {
                    $discount = Discount::find($discountId);
                    if (! $discount) {
                        Log::warning('Discount not found during update', ['discount_id' => $discountId]);
                        continue;
                    }

                    $previousPrice = $currentPrice;

                    $discountAmount = match ($discount->type) {
                        'fixed' => $discount->value,
                        'percentage' => $previousPrice * ($discount->value / 100),
                        default => 0,
                    };

                    $currentPrice = $previousPrice - $discountAmount;

                    DB::table('discount_deals')->insert([
                        'deal_id' => $deal->id,
                        'discount_id' => $discountId,
                        'discount_amount' => $discountAmount,
                        'previous_price' => $previousPrice,
                        'current_price' => $currentPrice,
                    ]);
                }

                $deal->current_price = $currentPrice;
            } else {
                $deal->current_price = $deal->unit_price;
            }

            $deal->save();

            return response()->json([
                'message' => 'Deal updated successfully',
                'deal' => $deal,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating deal:', [
                'exception' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);

            return response()->json(['message' => 'Internal server error'], 500);
        }
    }


    public function destroyDeal(Deal $deal)
    {
        $deal->delete();

        return response()->json(['message' => 'Deal deleted successfully']);
    }

    public function deleteMultiple(Request $request)
    {
        $dealIds=$request->input('deal_ids');

        if(is_array($dealIds) && count($dealIds) > 0) {
            Deal::whereIn('id', $dealIds)->delete();

            return response()->json(['message' => 'Deals deleted successfully']);
        }

        return response()->json(['message' => 'No deals selected'], 400);
    }

    public function assignProductView(Deal $deal)
    {
        //$categories = Category::all();  // For populating the dropdown
        //$products = Product::all();
        //$discounts = Discount::all();
        $user = auth()->user();

        // Load both categorydeals and discountdeals relationships
        $deal->load('categorydeals', 'discountdeals');

        return Inertia::render('Products/deal_product_assign', [
            //'products' => $products,
            //'categories' => $categories,
            //'discounts' => $discounts,
            'auth' => $user,
            'deal' => $deal,
        ]);
    }

    public function assignProducts(Request $request, $dealId)
    {
        $validator = Validator::make($request->all(), [
            'product_ids' => 'required|array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $deal = Deal::findOrFail($dealId);
            $productIds = $request->input('product_ids');

            // Clear existing product associations
            DB::table('deal_products')->where('deal_id', $deal->id)->delete();

            foreach ($productIds as $productId) {
                DB::table('deal_products')->insert([
                    'deal_id' => $deal->id,
                    'product_id' => $productId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json(['message' => 'Products assigned successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }

}
