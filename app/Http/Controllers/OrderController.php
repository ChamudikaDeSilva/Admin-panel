<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderStage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function getOrderCount()
    {
        $user = Auth::user();

        $orderCount = Order::where('user_id', $user->id)->count();

        // Fetch the first two discounts and log them
        $firstOrderDiscount = Discount::where('code', 'disc001')->first();
        $fifthOrderDiscount = Discount::where('code', 'disc002')->first();

        // Return the data as JSON
        return response()->json([
            'order_count' => $orderCount,
            'first_order_discount' => $firstOrderDiscount->value ?? 0,
            'fifth_order_discount' => $fifthOrderDiscount->value ?? 0,
        ]);
    }

    public function getOrdersByUser()
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)->get();

        return response()->json(['orders' => $orders]);
    }

    public function getOrderDetailsById($orderId)
    {
        try {
            Log::info("Fetching order details for order ID: {$orderId}");

            // Fetch the order with related items, product details, and discounts
            $order = Order::with(['items.product', 'discounts'])->where('id', $orderId)->first();

            if (! $order) {
                Log::warning("Order not found for order ID: {$orderId}");

                return response()->json(['message' => 'Order not found'], 404);
            }

            // Add the product name to each order item
            foreach ($order->items as $item) {
                $item->product_name = $item->product->name; // Assuming the 'Product' model has a 'name' attribute
            }

            // Format discount data (if any)
            $order->discounts->transform(function ($discount) {
                return [
                    'discount_id' => $discount->id,
                    'discount_amount' => $discount->discount_amount,
                    'previous_price' => $discount->previous_price,
                    'current_price' => $discount->current_price,
                ];
            });

            Log::info('Order found: ', $order->toArray());

            return response()->json(['order' => $order], 200);
        } catch (\Exception $e) {
            Log::error("Error fetching order details for order ID: {$orderId}. Error: {$e->getMessage()}");

            return response()->json(['message' => 'Error fetching order details'], 500);
        }
    }

    public function getOrderStages($orderId)
    {
        /*$latestStage = OrderStage::where('order_id', $orderId)
            ->orderBy('id', 'desc')
            ->first();*/

        $latestStage = DB::table('order_stages')
            ->where('order_id', $orderId)
            ->orderBy('id', 'desc')
            ->first();

        // Determine the current stage
        $currentStage = $latestStage ? $latestStage->stage_id : 1;

        // Fetch the OrderStage entry corresponding to the current stage
        $orderStage = DB::table('order_stages')
            ->where('order_id', $orderId)
            ->where('stage_id', $currentStage)
            ->first();

        // Get the created_at timestamp if the stage exists
        $expectedArrival = $orderStage ? $orderStage->created_at : null;

        // Add 7 days to the expectedArrival date
        $expectedArrivalDate = $expectedArrival ? Carbon::parse($expectedArrival)->addDays(7) : null;

        // Fetch the order details
        $order = Order::findOrFail($orderId);

        // Return the JSON response with order details, current stage, and updated expected arrival
        return response()->json([
            'order' => $order,
            'currentStage' => $currentStage,
            'expectedArrival' => $expectedArrivalDate ? $expectedArrivalDate->toDateString() : null, // Format date as needed
        ]);
    }
}
