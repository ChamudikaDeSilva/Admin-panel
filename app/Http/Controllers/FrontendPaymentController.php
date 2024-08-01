<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class FrontendPaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Use the total amount passed from the frontend
            $amount = $request->total_amount * 100; // Convert to cents

            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'usd',
                'payment_method' => $request->payment_method_id,
                'confirmation_method' => 'manual',
                'confirm' => true,
            ]);

            // Store order details in the database
            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_code' => $this->generateOrderCode(),
                'date' => Carbon::now()->toDateString(),
                'total_amount' => $amount, // Convert to appropriate currency unit
                'billing_address' => $request->formData['billingAddress'],
                'shipping_address' => $request->formData['shippingAddress'],
                'payment_type' => 'card',
                'payment_currency' => 'USD', // or whatever currency you prefer
                'status' => 'pending',
                'payment_status' => 'unpaid'
            ]);

            return response()->json([
                'success' => true,
                'paymentIntent' => $paymentIntent,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function placeOrder(Request $request)
    {
        //Log::info('Request Data:', [$request->all()]);

        // Extract formData from the request
        $formData = $request->input('formData');

        // Validate formData array
        $validated = Validator::make($formData, [
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

        // Validate other fields
        $request->validate([
            'total_amount' => 'required|numeric',
            'payment_type' => 'required|string',
            'payment_currency' => 'string|default:LKR',

        ]);

        //Log::info('Validated Data:', $validated);

        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Create order
        $order = new Order();
        $order->user_id = Auth::id();
        $order->date = Carbon::now()->toDateString();
        $order->first_name = $validated['firstName'];
        $order->last_name = $validated['lastName'];
        $order->order_code = 'ORD-' . strtoupper(uniqid());
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

        $order->save();

        return response()->json(['message' => 'Order placed successfully!', 'order' => $order], 201);
    }

    private function generateOrderCode()
    {
        return 'ORD-' . strtoupper(uniqid());
    }

}
