<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class FrontendOrdersController extends Controller
{
    public function fetchorders()
    {
        $orders=Order::All();
    }
}
