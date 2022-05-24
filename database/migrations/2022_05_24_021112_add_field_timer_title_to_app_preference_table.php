<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldTimerTitleToAppPreferenceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('app_preference', function (Blueprint $table) {
            $table->string('timer_title')->nullable();
            $table->string('button_label')->nullable();
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
            $table->dropColumn('timer_title');
            $table->dropColumn('button_label');
        });
    }
}
