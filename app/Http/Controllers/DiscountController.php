<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Discount;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\SubCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function discountIndex()
    {
        $discounts = Discount::all();

        return Inertia::render('Products/discount', [
            'discounts' => $discounts,
        ]);
    }


    public function fetchDiscounts()
    {
        try {
            $discounts = Discount::all();
            $products = Product::all();
            $categories = Category::all();
            $subcategories = SubCategory::all();

            // Log successful retrieval of data
            //Log::info('Successfully fetched discounts, products, categories, and subcategories.');

            return response()->json(['discounts' => $discounts, 'products' => $products, 'categories' => $categories, 'subcategories' => $subcategories]);
        } catch (\Exception $e) {
            // Log error if an exception occurs
            //Log::error('Error fetching discounts and related data: ' . $e->getMessage());

            // Return error response
            return response()->json(['error' => 'Error fetching discounts and related data.'], 500);
        }
    }


    public function createDiscount(Request $request)
    {
        $request->validate([
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        // Generate a unique code for the discount
        $latestDiscount = Discount::latest()->first(); // Get the latest discount
        $code = 'disc' . str_pad(optional($latestDiscount)->id + 1, 3, '0', STR_PAD_LEFT); // Generate new code

        $discount = Discount::create([
            'code' => $code,
            'type' => $request->input('type'),
            'value' => $request->input('value'),
            'description' => $request->input('description'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ]);

        return response()->json(['message' => 'Discount created successfully']);
    }

    public function deleteMultiple(Request $request)
    {
        $discountIds = $request->input('discount_ids');

        if (is_array($discountIds) && count($discountIds) > 0) {
            Discount::whereIn('id', $discountIds)->delete();
            return response()->json(['message' => 'Discounts deleted successfully']);
        }

        return response()->json(['message' => 'No discounts selected'], 400);
    }

    public function editDiscount($id)
    {
        $discount = Discount::findOrFail($id);
        $authUser = auth()->user();

        return Inertia::render('Products/discount_edit', [
            'discount' => $discount,
            'auth' => $authUser,
        ]);
    }

    public function updateDiscount(Request $request, $id)
    {
        try {
            // Validate incoming request data
            $validator = Validator::make($request->all(), [
                'type' => 'required|in:percentage,fixed',
                'value' => 'required|numeric',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Find the discount by ID
            $discount = Discount::findOrFail($id);

            // Update discount fields
            $discount->type = $request->input('type');
            $discount->value = $request->input('value');
            $discount->description = $request->input('description');
            $discount->start_date = Carbon::parse($request->input('start_date'))->format('Y-m-d');
            $discount->end_date = Carbon::parse($request->input('end_date'))->format('Y-m-d');

            // Save the updated discount
            $discount->save();

            return response()->json(['message' => 'Discount updated successfully', 'discount' => $discount], 200);
        } catch (\Exception $e) {
            Log::error('Error updating discount: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


    public function destroyDiscount($id)
    {
        $discount = Discount::find($id);

        if (!$discount) {
            return response()->json(['message' => 'Discount not found'], 404);
        }

        try {
            $discount->delete();
            return response()->json(['message' => 'Discount deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete discount'], 500);
        }
    }






}
