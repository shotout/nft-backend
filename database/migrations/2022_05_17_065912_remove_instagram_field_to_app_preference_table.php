<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveInstagramFieldToAppPreferenceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
            Schema::table('app_preference', function (Blueprint $table) {
                $table->dropColumn('instagram');
            });

            Schema::table('app_preference', function (Blueprint $table) {
                $table->string('headline_color')->nullable();
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('app_preference', function (Blueprint $table) {
            //
        });
    }
}
