<?php

use App\Models\Blockchain;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaqController;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\PageController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\WalletsController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\BlockchainsController;
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


Route::get('/', function () {
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

Route::prefix('promotion')->middleware('auth:web')->group(function () {
    Route::get('/list', [PromotionController::class, 'index'])->name('promotion.list');
    Route::get('/edit/{id}', [PromotionController::class, 'edit'])->name('promotion.edit');
    Route::get('/create', [PromotionController::class, 'create']);
    Route::post('/upload', [PromotionController::class, 'upload'])->name('images.upload');
    Route::post('/save-promotion', [PromotionController::class, 'store'])->name('promotion.store');
    Route::post('/save-collection', [PromotionController::class, 'collection'])->name('promotion.collection');
    Route::post('/save-theme', [PromotionController::class, 'savetheme'])->name('update.theme');
    Route::post('/update', [PromotionController::class, 'update'])->name('promotion.update');
});

Route::prefix('wallet')->middleware('auth:web')->group(function () {
    Route::get('/list', [WalletsController::class, 'index'])->name('wallet.list');
    Route::get('/create', [WalletsController::class, 'create'])->name('wallet.create');
    Route::post('/save', [WalletsController::class, 'store'])->name('wallet.save');
    Route::post('/delete/{id}', [WalletsController::class, 'destroy'])->name('wallet.delete');
    Route::get('/edit/{id}', [WalletsController::class, 'edit'])->name('wallet.edit');
    Route::post('/update', [WalletsController::class, 'update'])->name('wallet.update');
});

Route::prefix('blockchain')->middleware('auth:web')->group(function () {
    Route::get('/list', [BlockchainsController::class, 'index'])->name('bc.list');
    Route::get('/create', [BlockchainsController::class, 'create'])->name('bc.create');
    Route::post('/save', [BlockchainsController::class, 'store'])->name('bc.save');
    Route::post('/delete/{id}', [BlockchainsController::class, 'destroy'])->name('bc.delete');
    Route::get('/edit/{id}', [BlockchainsController::class, 'edit'])->name('bc.edit');
    Route::post('/update', [BlockchainsController::class, 'update'])->name('bc.update');
});

Route::prefix('faq')->middleware('auth:web')->group(function () {
    Route::get('/list', [FaqController::class, 'index'])->name('faq.list');
    Route::get('/create', [FaqController::class, 'create'])->name('faq.create');
    Route::post('/save', [FaqController::class, 'store'])->name('faq.save');
    Route::post('/delete/{id}', [FaqController::class, 'destroy'])->name('faq.delete');
    Route::get('/edit/{id}', [FaqController::class, 'edit'])->name('faq.edit');
    Route::post('/update', [FaqController::class, 'update'])->name('faq.update');
});


//login
Route::post('/authenticate',  [LoginController::class, 'authenticate'])->name('login.post');


Route::get('/', [LoginController::class, 'index'])->name('logincms');
Route::get('/logout', [LoginController::class, 'logout'])->name('logout');

Route::webhooks('webhook-receiving-url');

// apple url
Route::get('/apple-app-site-association', [PageController::class, 'apple'])->name('apple');