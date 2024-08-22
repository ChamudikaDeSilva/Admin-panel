<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function getOrderCount()
    {
        $user = Auth::user();
        $orderCount = Order::where('user_id', $user->id)->count();

        // Fetch the first two discounts
        $firstOrderDiscount = Discount::where('code', 'disc001')->first();
        $fifthOrderDiscount = Discount::where('code', 'disc002')->first();

        return response()->json([
            'order_count' => $orderCount,
            'first_order_discount' => $firstOrderDiscount->percentage ?? 0,
            'fifth_order_discount' => $fifthOrderDiscount->percentage ?? 0,
        ]);
    }

}
