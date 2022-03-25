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
            $table->id();
            $table->string('uuid')->unique()->nullable();
            $table->string('sample')->nullable();
            $table->dateTime('publish_date')->nullable();
            $table->boolean('has_notif')->default(false);
            $table->timestamps();
        });

        Schema::create('user_watchlists', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique()->nullable();
            $table->integer('user_id')->nullable();
            $table->integer('product_id')->nullable();
            $table->timestamps();
        });

        // adding products
        DB::table('products')->insert([
            ['uuid' => Uuid::uuid4(), 'sample' => 'data sample', 'publish_date' => now(), 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'sample' => 'data sample', 'publish_date' => now(), 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'sample' => 'data sample', 'publish_date' => now(), 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'sample' => 'data sample', 'publish_date' => now(), 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'sample' => 'data sample', 'publish_date' => now(), 'created_at' => now()],
        ]);
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
