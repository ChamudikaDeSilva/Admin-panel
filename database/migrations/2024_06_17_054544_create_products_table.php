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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('sub_category_id');
            $table->string('name');
            $table->decimal('quantity');
            $table->decimal('price');
            $table->boolean('isAvailable')->nullable()->default('true');

            $table->timestamps();

            $table->foreign('category_id')->reference('id')->on('categories');
            $table->foreign('sub_category_id')->reference('id')->on('sub_categories');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
