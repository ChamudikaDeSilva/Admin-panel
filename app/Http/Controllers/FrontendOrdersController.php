<?php

namespace App\Http\Controllers;

use App\Models\Order;

class FrontendOrdersController extends Controller
{
    public function fetchorders()
    {
        $orders = Order::All();
    }
}