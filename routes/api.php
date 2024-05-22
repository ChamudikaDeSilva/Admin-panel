<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PermissionController;

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

