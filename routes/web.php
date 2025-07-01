<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ModulePermissionController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductManagementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['web'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

});

require __DIR__.'/auth.php';

Route::get('/test-db', function() {
    try {
        DB::connection()->getPdo();
        return "Connected successfully to: " . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
});

//Route::get('/modules', [ModuleController::class, 'index'])->name('modules');
Route::get('/modules', [ModuleController::class, 'index'])->middleware(['auth', 'verified'])->name('modules');
Route::get('/permissions', [PermissionController::class, 'index'])->middleware(['auth', 'verified'])->name('permissions');
Route::get('/module/permissions', [ModulePermissionController::class, 'index'])->middleware(['auth', 'verified'])->name('modules_permissions');

//User Management
Route::get('/user/management/admins', [UserManagementController::class, 'adminIndex'])->middleware(['auth', 'verified'])->name('admin_management');
Route::get('/user/management/admins/edit/{id}', [UserManagementController::class, 'editAdmin'])->middleware(['auth', 'verified'])->name('admins.edit');

//Product Management
Route::get('/product/management/categories', [CategoryController::class, 'categoryIndex'])->middleware(['auth', 'verified'])->name('category_management');
Route::get('/product/management/categories/edit/{id}', [CategoryController::class, 'editCategory'])->middleware(['auth', 'verified'])->name('categories.edit');

Route::get('/product/management/subcategories', [SubCategoryController::class, 'subcategoryIndex'])->middleware(['auth', 'verified'])->name('subcategory_management');
Route::get('/product/management/subcategories/edit/{subcategory}', [SubCategoryController::class, 'editSubCategory'])->middleware(['auth', 'verified'])->name('subcategories.edit');

Route::get('/product/management/products', [ProductManagementController::class, 'productIndex'])->middleware(['auth', 'verified'])->name('product_management');
Route::get('/product/management/products/edit/{product}', [ProductManagementController::class, 'editProduct'])->middleware(['auth', 'verified'])->name('products.edit');

Route::get('/product/management/discounts', [DiscountController::class, 'discountIndex'])->middleware(['auth', 'verified'])->name('discount_management');
Route::get('/product/management/discounts/edit/{product}', [DiscountController::class, 'editDiscount'])->middleware(['auth', 'verified'])->name('discounts.edit');

Route::get('/product/management/deals', [DealController::class, 'dealIndex'])->middleware(['auth', 'verified'])->name('deal_management');
Route::get('/product/management/deals/edit/{deal}', [DealController::class, 'editDeal'])->middleware(['auth', 'verified'])->name('deals.edit');
Route::get('/product/management/deals/assign/products', [DealController::class, 'assignProductView'])->middleware(['auth', 'verified'])->name('deals.assignProduct');



Route::get('/check-storage-link', function () {
    $link = public_path('storage');
    return response()->json([
        'exists' => file_exists($link),
        'is_link' => is_link($link),
        'target' => readlink($link),
    ]);
});


