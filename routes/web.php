<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
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


Route::get('/a', function () {
    return view('auth.login');
});

Route::get('/clear-cache', function () {
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('config:clear');
});

//admin
Route::prefix('admin')->middleware('auth:web')->group(function () {
    Route::get('/list', [AdminController::class, 'index'])->name('admin');
    Route::post('/change-status', [AdminController::class, 'changeStatus']);
    Route::get('/create-admin', [AdminController::class, 'create']);
    Route::post('save-admin', [AdminController::class, 'store']);
    Route::get('edit/{id}', [AdminController::class, 'edit']);
});

//login
Route::post('/authenticate',  [LoginController::class, 'authenticate'])->name('login.post');


Route::get('/', [LoginController::class, 'index'])->name('login');
Route::get('/logout', [LoginController::class, 'logout'])->name('logout');