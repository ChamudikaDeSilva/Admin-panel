<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
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
}
