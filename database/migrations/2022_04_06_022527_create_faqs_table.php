<?php

use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFaqsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique()->nullable();
            $table->text('question')->nullable();
            $table->text('answer')->nullable();
            $table->integer('parent')->nullable();
            $table->timestamps();
        });

        // adding faqs
        DB::table('faqs')->insert([
            ['uuid' => Uuid::uuid4(), 'question' => 'What is an NFT?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'What is a wallet, and why do I need one?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'How can I buy an NFT?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'How can I avoid scams?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'What is a floor price?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'When are new projects posted?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'How is a project verified?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'What are the benefits of joining a whitelist?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'Where can I report bugs or other problems?', 'answer' => 'to do', 'parent' => null, 'created_at' => now()],

            ['uuid' => Uuid::uuid4(), 'question' => 'Best practices for creating and maintaining a wallet', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'Staying safe on Discord', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'Detecting scams and fakes in advance', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'Keeping your devices safe', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'Accessing mobile links on your desktop PC.', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'How to store your seed phrase safely', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'I think my wallet is compromised, what can I do?', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'How is a project verified?', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
            ['uuid' => Uuid::uuid4(), 'question' => 'Reporting fraudulent activity', 'answer' => 'to do', 'parent' => 4, 'created_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faqs');
    }
}
