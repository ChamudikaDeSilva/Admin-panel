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
        Schema::create('order_deliveries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('deliveryman_id');
            $table->unsignedBigInteger('customer_id');
            $table->string('deliveryman_name');
            $table->string('status')->default('pending');
            $table->string('delivery_address');
            $table->date('delivery_date')->nullable();

            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('deliveryman_id')->references('id')->on('users');
            $table->foreign('customer_id')->references('id')->on('users');
        });
    }




    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_deliveries');
    }
};
