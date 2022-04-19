<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WatchlistController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(
    [
        'prefix' => 'v1/wallet',
        'name' => 'wallet.'
    ],
    function() {
        Route::get('/', [WalletController::class, 'list'])->name('list');
    }
);

Route::group(
    [
        'prefix' => 'v1/auth',
        'name' => 'auth.'
    ],
    function() {
        Route::post('/register', [AuthController::class, 'register'])->name('register');
        Route::post('/login', [AuthController::class, 'login'])->name('login');
        Route::get('/verify/{token}', [AuthController::class, 'verify'])->name('verify');
    }
);

Route::group(
    [
        'prefix' => 'v1/users',
        'name' => 'user.'
    ],
    function() {
        Route::get('/', [UserController::class, 'show'])->name('show');
        Route::patch('/', [UserController::class, 'update'])->name('update');
    }
);

Route::group(
    [
        'middleware' => 'auth:sanctum',
        'prefix' => 'v1/products',
        'name' => 'product.'
    ],
    function() {
        Route::get('/', [ProductController::class, 'list'])->name('listproducts');
        Route::get('/{id}', [ProductController::class, 'show'])->name('showproducts');
    }
);

Route::group(
    [
        'middleware' => 'auth:sanctum',
        'prefix' => 'v1/watchlists',
        'name' => 'watchlist.'
    ],
    function() {
        Route::get('/', [WatchlistController::class, 'list'])->name('listwatchlists');
        Route::post('/{id}', [WatchlistController::class, 'store'])->name('store');
        Route::delete('/{id}', [WatchlistController::class, 'destroy'])->name('destroy');
    }
);

Route::group(
    [
        'middleware' => 'auth:sanctum',
        'prefix' => 'v1/faqs',
        'name' => 'faq.'
    ],
    function() {
        Route::get('/', [FaqController::class, 'list'])->name('listfaqs');
        Route::get('/show/{id}', [FaqController::class, 'show'])->name('showfaqs');
        Route::get('/{flag}', [FaqController::class, 'flag'])->name('flag');
    }
);
