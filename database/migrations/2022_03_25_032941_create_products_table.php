<?php

use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('uuid')->unique();
            $table->string('nft_title')->nullable();
            $table->string('nft_type')->nullable();
            $table->string('nft_price')->nullable();
            $table->string('nft_amount')->nullable();
            $table->text('nft_description')->nullable();
            $table->text('nft_raffle')->nullable();
            $table->text('nft_community')->nullable();
            $table->date('nft_publish_date')->nullable();
            $table->boolean('is_verified')->default(0); 
            $table->boolean('is_published')->default(0);
            $table->timestamp('created_at')->nullable()->useCurent();
            $table->timestamp('updated_at')->nullable();
            
        });

        Schema::create('user_watchlists', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique()->nullable();
            $table->string('user_id')->nullable();
            $table->string('product_id')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('user_watchlists');
    }
}
