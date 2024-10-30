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
            //Log::info('Creating a new deal', ['request_data' => $request->all()]);

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
                //Log::error('Validation failed', ['errors' => $validator->errors()]);

                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = $image->getClientOriginalName();
                $imagePath = $image->storeAs('deals', $imageName, 'public');
                $imageUrl = Storage::url($imagePath);
                //Log::info('Image uploaded successfully', ['image_url' => $imageUrl]);
            } else {
                //Log::error('Image file is required but not provided');

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
            //Log::info('Deal created successfully', ['deal_id' => $deal->id]);

            // Insert category_id and deal_id into category_deals table
            DB::table('category_deals')->insert([
                'category_id' => $request->input('category_id'),
                'deal_id' => $deal->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            //Log::info('Category-deal relation saved', ['category_id' => $request->input('category_id'), 'deal_id' => $deal->id]);

            // Handle discounts
            $current_price = $deal->unit_price;
            if ($request->has('discount_ids')) {
                $discounts = $request->input('discount_ids');
                foreach ($discounts as $discountId) {
                    $discount = Discount::find($discountId);
                    if (! $discount) {
                        //Log::warning('Discount not found', ['discount_id' => $discountId]);
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
                //Log::info('No discounts applied, current price set to unit price', ['deal_id' => $deal->id]);
            }

            return response()->json([
                'message' => 'Deal created successfully!',
                'deal' => $deal,
            ], 201);
        } catch (Exception $e)
        {
            //Log::error('Error creating deal', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while creating the deal. Please try again.'], 500);
        }
    }

    public function assignProducts()
    {

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

            'description' => 'required|string',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:0',
            'availability' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', ['errors' => $validator->errors()]);

            return response()->json($validator->errors(), 422);
        }

        try {
            $deal = Deal::findOrFail($dealId);

            // Update product details (except image)
            $deal->update([
                'name' => $request->name,
                'category_id' => $request->category_id,

                'description' => $request->description,
                'unit_price' => $request->unit_price,
                'quantity' => $request->quantity,
                'isAvailable' => $request->availability,

            ]);

            // Handle image upload (if provided)
            if ($request->hasFile('image')) {
                // Remove existing image if present
                if ($deal->image) {
                    Storage::disk('public')->delete($deal->image);
                }

                $image = $request->file('image');
                $imageName = $image->getClientOriginalName();
                $imagePath = $image->storeAs('deals', $imageName, 'public');
                $imageUrl = Storage::url($imagePath);

                $deal->image = $imageUrl;
            }

            $deal->save();

            return response()->json(['message' => 'Deal updated successfully', 'product' => $deal], 201);
        } catch (\Exception $e) {
            Log::error('Error updating deal:', [
                'exception' => $e->getMessage(),
                'request_data' => $request->all(),
            ]);

            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
}
