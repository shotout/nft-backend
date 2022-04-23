<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Ramsey\Uuid\Uuid;

class AddActiveFieldToAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->boolean('is_active')->default(0)->index('admin_is_inactive_index')->comment('1 for active and 0 for inactive.');
        });

        $password = Hash::make('admin@nftcms');
        DB::table('admins')->insert([
            ['uuid' => Uuid::uuid4(), 'name' => 'admin', 'email' => 'admin@mail.com', 'password' => $password,'is_active' => '1', 'created_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->boolean('is_active')->default(0)->index('admin_is_inactive_index')->comment('1 for active and 0 for inactive.');
        });
    }
}
