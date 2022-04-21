<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreatePreferencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('preferences', function (Blueprint $table) {
            $table->id();
            $table->string('category')->nullable();
            $table->string('field')->nullable();
            $table->string('value',500)->nullable();
        });

        DB::table('preferences')->insert([
            ['category' => 'preference', 'field' => 'theme_preference', 'value' => '{"theme_mode":"menu-light","header_background":"header-purple","menu_background":"navbar-purple","menu_brand_background":"brand-blue","menu_item_color":"active-red","navbar_image":"navbar-image-5","menu-icon-colored":"icon-colored","menu_list_icon":"menu-item-icon-style5","menu_dropdown_icon":"drp-icon-style2"}' ]
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('preferences');
    }
}
