<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\FrontendOrdersController;
use App\Http\Controllers\FrontendPaymentController;
use App\Http\Controllers\FrontendProductController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ModulePermissionController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductManagementController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Modules
Route::get('/modules/get', [ModuleController::class, 'moduleIndex']);
Route::post('/modules/create', [ModuleController::class, 'store']);
Route::delete('/modules/delete/{id}', [ModuleController::class, 'destroy']);

//Permissions
Route::get('/permissions/get', [PermissionController::class, 'permissionIndex']);
Route::post('/permissions/create', [PermissionController::class, 'store']);
Route::delete('/permissions/delete/{id}', [PermissionController::class, 'destroy']);

//Module Permissions
Route::get('roles/modules/permissions/get', [ModulePermissionController::class, 'modulePermissionIndex']);
Route::post('/module/permissions/create', [ModulePermissionController::class, 'store']);
Route::delete('/module/permissions/delete', [ModulePermissionController::class, 'destroy']);
Route::get('/module/permissions/{role}', [ModulePermissionController::class, 'fetchModulePermissions']);

//User Management
Route::post('/user/management/admins/create', [UserManagementController::class, 'createAdmin'])->name('admins.store');
Route::get('/user/management/fetch/admins', [UserManagementController::class, 'fetchAdmins']);

Route::put('/user/management/update/admin/{id}', [UserManagementController::class, 'updateAdmin'])->name('admins.update');
Route::delete('/user/management/delete/admin/{id}', [UserManagementController::class, 'destroy'])->name('admins.delete');
Route::put('/user/management/disable/admin/{id}', [UserManagementController::class, 'toggleUserStatus'])->name('admins.disable');
Route::get('/user/management/admin/status/{id}', [UserManagementController::class, 'getAdminStatus'])->name('admins.getUserStatus');
Route::post('/user/management/admin/delete/multiple', [UserManagementController::class, 'deleteMultiple'])->name('admins.deleteMultiple');

//Product Management
//------Category Management
Route::post('/product/management/category/create', [CategoryController::class, 'createCategory'])->name('categories.store');
Route::get('/product/management/fetch/categories', [CategoryController::class, 'fetchCategories']);

Route::put('/product/management/update/category/{id}', [CategoryController::class, 'updateCategory'])->name('category.update');
Route::delete('/product/management/delete/category/{id}', [CategoryController::class, 'destroyCategory'])->name('category.delete');
Route::post('/product/management/delete/multiple/categories', [CategoryController::class, 'deleteMultiple'])->name('categories.deleteMultiple');

//------Sub Category Management
Route::post('/product/management/subcategory/create', [SubCategoryController::class, 'createSubCategory'])->name('subcategories.store');
Route::get('/product/management/fetch/subcategories', [SubCategoryController::class, 'fetchSubCategories']);
Route::put('/product/management/update/subcategory/{subcategory}', [SubCategoryController::class, 'updateSubCategory'])->name('subcategory.update');
Route::delete('/product/management/delete/subcategory/{subcategory}', [SubCategoryController::class, 'destroySubCategory'])->name('subcategories.delete');
Route::post('/product/management/delete/multiple/subcategories', [SubCategoryController::class, 'deleteMultiple'])->name('subcategories.deleteMultiple');

//------Products Management
Route::post('/product/management/product/create', [ProductManagementController::class, 'createProduct'])->name('products.store');
Route::get('/product/management/fetch/products', [ProductManagementController::class, 'fetchProducts']);
Route::post('/product/management/update/products/{productId}', [ProductManagementController::class, 'updateProduct'])->name('product.update');
Route::delete('/product/management/delete/products/{product}', [ProductManagementController::class, 'destroyProduct'])->name('products.delete');
Route::post('/product/management/delete/multiple/products', [ProductManagementController::class, 'deleteMultiple'])->name('products.deleteMultiple');

//------Discounts Management
Route::get('/product/management/fetch/discounts', [DiscountController::class, 'fetchDiscounts']);
Route::post('/product/management/discount/create', [DiscountController::class, 'createDiscount'])->name('discounts.store');
Route::post('/product/management/delete/multiple/discounts', [DiscountController::class, 'deleteMultiple'])->name('discounts.deleteMultiple');
Route::put('/product/management/update/discounts/{discountId}', [DiscountController::class, 'updateDiscount'])->name('discount.update');
Route::delete('/product/management/delete/discounts/{discount}', [DiscountController::class, 'destroyDiscount'])->name('discounts.delete');

//------Frontend API--------------------------------
Route::get('/shop/data/fetch', [FrontendProductController::class, 'shopIndex']);
Route::get('/shop/product/fetch', [FrontendProductController::class, 'fetchProducts']);

Route::middleware(['api'])->group(function () {
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
});

//Route::middleware('auth:api')->get('auth/user', [AuthController::class, 'getCurrentUser']);

Route::middleware('auth:api')->group(function () {
    Route::get('auth/user', [AuthController::class, 'getCurrentUser']);
    Route::post('/create-payment-intent', [FrontendPaymentController::class, 'createPaymentIntent']);
    Route::post('place-order', [FrontendPaymentController::class, 'placeOrder']);
    Route::get('/fetch-order', [FrontendOrdersController::class, 'fetchorders']);
    Route::get('/user/order-count', [OrderController::class, 'getOrderCount']);
});
