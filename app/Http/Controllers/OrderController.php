<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
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
}
