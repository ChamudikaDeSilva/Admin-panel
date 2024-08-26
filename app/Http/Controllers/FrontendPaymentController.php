<?php

namespace App\Http\Controllers;

use App\Models\Order;
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

        $quantityCheck = $this->adjustProductQuantity($request->input('cartData')['items']);
        if ($quantityCheck) {
            return $quantityCheck;
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

    public function placeOrder(Request $request)
    {
        // Validate the form data
        $validated = Validator::make($request->input('formData'), [
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

        // Validate the rest of the request data
        $request->validate([
            'total_amount' => 'required|numeric',
            'payment_type' => 'required|string',
            'payment_currency' => 'string|default:LKR',
        ]);

        // Check if the user is authenticated
        if (! Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Ensure the email in the request matches the authenticated user's email
        $authenticatedUserEmail = Auth::user()->email;
        $requestEmail = $validated['email'];

        if (strtolower($authenticatedUserEmail) !== strtolower($requestEmail)) {
            return response()->json(['message' => 'Email mismatch'], 400);
        }

        // Create a new order
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
        $order->total_amount = $request->input('total_amount');
        $order->payment_type = $request->input('payment_type');
        $order->payment_currency = $request->input('payment_currency', 'LKR');

        // Save the order
        $order->save();

        // Deduct quantity from the products
        foreach ($request->input('cartData.items') as $cartItem) {
            $product = Product::find($cartItem['id']);
            if ($product) {
                // Extract the numeric part of the unit
                preg_match('/\d+/', $product->unit, $matches);
                $unitValue = $matches[0] ?? 1; // Default to 1 if no numeric value is found

                // Multiply product quantity by 1000 (assuming it's in kg and needs to be converted to g)
                $productQuantityInGrams = $product->quantity * 1000;

                $ProductQuantityInRequest = ($cartItem['quantity'] * $unitValue);

                // Calculate the new quantity
                $newQuantity = $productQuantityInGrams - $ProductQuantityInRequest;

                if ($productQuantityInGrams >= $ProductQuantityInRequest) {
                    // Convert the new quantity back to kg
                    $product->quantity = $newQuantity / 1000;
                    $product->save();
                } else {
                    $product->isAvailable = false;
                    $product->save();

                    return response()->json(['message' => 'Insufficient stock at the moment for product ID: '.$cartItem['id']], 400);
                }
            }
        }

        return response()->json(['message' => 'Order placed successfully!', 'order' => $order], 201);
    }

    private function generateOrderCode()
    {
        return 'ORD-'.strtoupper(uniqid());
    }
}
