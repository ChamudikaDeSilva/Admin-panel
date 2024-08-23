<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('order_code');
            $table->string('city');
            $table->string('country');
            $table->string('postal_code');
            $table->string('phone');
            $table->string('email');
            $table->date('date');
            $table->decimal('total_amount', 8, 2);
            $table->decimal('order_discounted_total', 8, 2)->nullable();
            $table->decimal('order_discount', 8, 2)->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['paid', 'unpaid', 'refunded'])->default('unpaid');
            $table->text('shipping_address')->nullable();
            $table->text('billing_address')->nullable();
            $table->string('payment_type');
            $table->string('payment_currency')->default('LKR');

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
