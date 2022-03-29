<?php

use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWalletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique()->nullable();
            $table->string('name')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('user_wallets', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique()->nullable();
            $table->string('user_id')->nullable();
            $table->string('wallet_id')->nullable();
            $table->timestamps();
        });

        // adding wallets
        DB::table('wallets')->insert([
            ['uuid' => Uuid::uuid4(), 'name' => 'Metamask', 'image' => 'metamask.png', 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'name' => 'Cardano', 'image' => 'cardano.png', 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'name' => 'Crypto.com', 'image' => 'crypto.png', 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'name' => 'Binance Smartchain', 'image' => 'binance.png', 'created_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('user_wallets');
    }
}
