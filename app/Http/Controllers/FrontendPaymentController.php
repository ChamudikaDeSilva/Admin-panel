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
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        // Log the incoming request data for debugging
        /*Log::info('Create Payment Intent Request', [
            'total_amount' => $request->input('total_amount'),
            'payment_type' => $request->input('payment_type'),
            'formData' => $request->input('formData'),
        ]);*/

        // Validate request data
        $request->validate([
            'total_amount' => 'required|numeric',
            'payment_type' => 'required|string',
            'payment_currency' => 'string|default:LKR',
            'formData' => 'required|array', // Ensure formData is validated as an array
        ]);

        // Extract and validate form data
        $formData = $request->input('formData');
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

        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if the email address in the request matches the authenticated user's email
        $authenticatedUserEmail = Auth::user()->email;
        $requestEmail = $validated['email'];

        if ($authenticatedUserEmail !== $requestEmail) {
            return response()->json(['message' => 'Email mismatch'], 400);
        }

        // Create the PaymentIntent
        $paymentIntent = PaymentIntent::create([
            'amount' => $request->total_amount * 100, // Amount in cents
            'currency' => 'usd',
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'never',
            ],
        ]);

        // Log the payment intent creation
        /*Log::info('Payment Intent Created', [
            'payment_intent_id' => $paymentIntent->id,
            'client_secret' => $paymentIntent->client_secret,
        ]);*/

        // Create order in the database
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
        //$order->status='completed';
        $order->payment_status = 'paid';
        $order->payment_currency = $request->input('payment_currency', 'LKR');

        $order->save();

        // Log the order creation
        /*Log::info('Order Created', [
            'order_id' => $order->id,
            'order_code' => $order->order_code,
        ]);*/

        return response()->json(['client_secret' => $paymentIntent->client_secret]);
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

        // Check if the email address in the request matches the authenticated user's email
        $authenticatedUserEmail = Auth::user()->email;
        $requestEmail = $validated['email'];

        if ($authenticatedUserEmail !== $requestEmail) {
            return response()->json(['message' => 'Email mismatch'], 400);
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
