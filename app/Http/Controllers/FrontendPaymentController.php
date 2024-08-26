<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderDiscount;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class FrontendPaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $request->validate([
            'total_amount' => 'required|numeric',
            'payment_type' => 'required|string',
            'payment_currency' => 'string|default:LKR',
            'formData' => 'required|array',
            'cartData' => 'required|array',
            'total_without_Discount' => 'nullable|numeric',
            'final_Discount' => 'nullable|numeric',
        ]);

        $validated = $this->validateAndExtractFormData($request);

        if (! Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $emailCheck = $this->checkEmailMatch($validated['email']);
        if ($emailCheck) {
            return $emailCheck;
        }

        $paymentIntent = PaymentIntent::create([
            'amount' => $request->total_amount * 100, // Amount in cents
            'currency' => 'usd',
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'never',
            ],
        ]);

        $order = $this->createOrder($validated, $request->total_amount, $request->input('payment_type'), $request->input('payment_currency', 'LKR'));

        $this->createOrderItems($request->input('cartData')['items'], $order->id); // Create order items

        $quantityCheck = $this->adjustProductQuantity($request->input('cartData')['items']);
        if ($quantityCheck) {
            return $quantityCheck;
        }

        if (!is_null($request->total_without_Discount) && !is_null($request->final_Discount)) {
            $this->createOrderDiscounts($order->id, $request->total_without_Discount, $request->final_Discount);
        }

        return response()->json(['client_secret' => $paymentIntent->client_secret]);
    }

    private function validateAndExtractFormData(Request $request)
    {
        $formData = $request->input('formData');

        return Validator::make($formData, [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'billingAddress' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postalCode' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'shippingAddress' => 'required|string|max:255',
        ])->validate();
    }

    private function checkEmailMatch($validatedEmail)
    {
        $authenticatedUserEmail = Auth::user()->email;
        if ($authenticatedUserEmail !== $validatedEmail) {
            return response()->json(['message' => 'Email mismatch'], 400);
        }
    }

    private function createOrder($validated, $totalAmount, $paymentType, $paymentCurrency)
    {
        $order = new Order;
        $order->user_id = Auth::id();
        $order->date = Carbon::now()->toDateString();
        $order->first_name = $validated['firstName'];
        $order->last_name = $validated['lastName'];
        $order->order_code = 'ORD-'.strtoupper(uniqid());
        $order->billing_address = $validated['billingAddress'];
        $order->city = $validated['city'];
        $order->country = $validated['country'];
        $order->postal_code = $validated['postalCode'];
        $order->phone = $validated['phone'];
        $order->email = $validated['email'];
        $order->shipping_address = $validated['shippingAddress'];
        $order->total_amount = $totalAmount;
        $order->payment_type = $paymentType;
        $order->payment_status = 'paid';
        $order->payment_currency = $paymentCurrency;

        $order->save();

        return $order;
    }

    private function adjustProductQuantity($cartItems)
    {
        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem['id']);
            if ($product) {
                preg_match('/\d+/', $product->unit, $matches);
                $unitValue = $matches[0] ?? 1; // Default to 1 if no numeric value is found

                $productQuantityInGrams = $product->quantity * 1000;
                $ProductQuantityInRequest = ($cartItem['quantity'] * $unitValue);
                $newQuantity = $productQuantityInGrams - $ProductQuantityInRequest;

                if ($productQuantityInGrams >= $ProductQuantityInRequest) {
                    $product->quantity = $newQuantity / 1000;
                    $product->save();
                } else {
                    $product->isAvailable = false;
                    $product->save();

                    return response()->json(['message' => 'Insufficient stock at the moment for product ID: '.$cartItem['id']], 400);
                }
            }
        }
    }

    private function createOrderItems($cartItems, $orderId)
    {
        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem['id']); // Fetch the product by its ID

            if ($product) {
                // Extract the numeric value from the unit (e.g., 250 from 250g)
                preg_match('/\d+/', $product->unit, $matches);
                $unitValue = $matches[0] ?? 1; // Default to 1 if no numeric value is found

                // Multiply the quantity by the unit value
                $adjustedQuantity = $cartItem['quantity'] * $unitValue;

                // Save the order item
                $orderItem = new OrderItem;
                $orderItem->order_id = $orderId;
                $orderItem->product_id = $cartItem['id'];
                $orderItem->category_id = $product->category_id; // Get category_id from the product
                $orderItem->sub_category_id = $product->sub_category_id; // Get sub_category_id from the product
                $orderItem->quantity = $adjustedQuantity . ' ' . preg_replace('/\d+/', '', $product->unit); // Save the quantity with the unit (e.g., 500 g)
                $orderItem->unit_price = $product->unit_price;
                $orderItem->current_price = $product->current_price;
                //$orderItem->total_price = $adjustedQuantity * $product->current_price / $unitValue; // Calculate total price based on adjusted quantity

                $orderItem->save();
            } else {
                // Handle case where the product is not found
                return response()->json(['message' => 'Product not found: ' . $cartItem['id']], 400);
            }
        }
    }

    private function createOrderDiscounts($orderId, $totalWithoutDiscount, $finalDiscount)
    {
        $user = Auth::user();
        $orderCount = Order::where('user_id', $user->id)->count();

        // Determine the discount code based on the order count
        $discountCode = null;
        if ($orderCount === 1) {
            $discountCode = 'disc001'; // First order discount
        } elseif ($orderCount % 5 === 0) {
            $discountCode = 'disc002'; // Fifth order or multiple of five discount
        }

        if ($discountCode) {
            // Find the discount ID by the discount code
            $discount = Discount::where('code', $discountCode)->first();

            if ($discount) {
                $orderDiscount = new OrderDiscount();
                $orderDiscount->order_id = $orderId;
                $orderDiscount->discount_id = $discount->id;
                $orderDiscount->discount_amount = $finalDiscount;
                $orderDiscount->previous_price = $totalWithoutDiscount;
                $orderDiscount->current_price = $totalWithoutDiscount - $finalDiscount;

                $orderDiscount->save();
            } else {
                // Handle case where the discount is not found
                return response()->json(['message' => 'Discount code not found'], 400);
            }
        }
    }


    public function placeOrder(Request $request)
    {
        // Validate the rest of the request data
        $request->validate([
            'total_amount' => 'required|numeric',
            'payment_type' => 'required|string',
            'payment_currency' => 'string|default:LKR',
            'total_without_Discount' => 'nullable|numeric',
            'final_Discount' => 'nullable|numeric',
        ]);

        $validated = $this->validateAndExtractFormData($request);

        // Check if the user is authenticated
        if (! Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $emailCheck = $this->checkEmailMatch($validated['email']);
        if ($emailCheck) {
            return $emailCheck;
        }

        $order = $this->createOrder($validated, $request->total_amount, $request->input('payment_type'), $request->input('payment_currency', 'LKR'));

        $this->createOrderItems($request->input('cartData')['items'], $order->id); // Create order items

        $quantityCheck = $this->adjustProductQuantity($request->input('cartData')['items']);
        if ($quantityCheck) {
            return $quantityCheck;
        }

        if (!is_null($request->total_without_Discount) && !is_null($request->final_Discount)) {
            $this->createOrderDiscounts($order->id, $request->total_without_Discount, $request->final_Discount);
        }

        return response()->json(['message' => 'Order placed successfully!', 'order' => $order], 201);
    }

    private function generateOrderCode()
    {
        return 'ORD-'.strtoupper(uniqid());
    }
}
