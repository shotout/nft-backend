<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirdropsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_airdrops', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('user_id')->nullable();
            $table->string('product_id')->nullable();            
            $table->timestamp('created_at')->nullable()->useCurent();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_airdrops');
    }
}
