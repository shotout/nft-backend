<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppPreference extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_preference', function (Blueprint $table) {
            $table->increments('id');
            $table->string('uuid')->unique();
            $table->foreignUuid('promotion_id')->index('app_preference_promotion_id_foreign');
            $table->string('main_color')->nullable();
            $table->string('background_color')->nullable();
            $table->string('gradient1_color')->nullable();
            $table->string('gradient2_color')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
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
        Schema::dropIfExists('app_preference');
    }
}
