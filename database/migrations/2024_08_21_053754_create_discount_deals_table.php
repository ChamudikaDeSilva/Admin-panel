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
        Schema::create('discount_deals', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('discount_id');
            $table->unsignedBigInteger('deal_id');
            $table->decimal('discount_amount');
            $table->decimal('previous_price');
            $table->decimal('current_price');

            $table->foreign('discount_id')->references('id')->on('discounts');
            $table->foreign('deal_id')->references('id')->on('deals');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_deals');
    }
};
