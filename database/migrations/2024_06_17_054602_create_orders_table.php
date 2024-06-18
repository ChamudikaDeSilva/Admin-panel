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
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('sub_category_id');
            $table->string('order_code');
            $table->date('date');
            $table->decimal('total_amount');
            $table->enum('status',['pending','processing','completed','cancelled'])->default('pending');
            $table->enum('payment_status',['paid','unpaid','refunded'])->default('unpaid');
            $table->string('shipping_method')->nullable();
            $table->text('shipping_address')->nullable();
            $table->text('billing_address')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_currency')->default('USD');

            $table->timestamps();

            $table->foreign('category_id')->reference('id')->on('categories');
            $table->foreign('product_id')->reference('id')->on('products');
            $table->foreign('user_id')->reference('id')->on('users');
            $table->foreign('sub_category_id')->reference('id')->on('sub_categories');
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
