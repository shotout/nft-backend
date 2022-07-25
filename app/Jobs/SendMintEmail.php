<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendMintEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;
    protected $product;
    protected $emailTo;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, Product $product, $emailTo)
    {
        $this->user = $user;
        $this->product = $product;
        $this->emailTo = $emailTo;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->user->email_message = "Mint now : ".$this->product->nft_title;
        Mail::send('email.minting', ['user' => $this->user, 'product' => $this->product], function($message) {
            $message->to($this->emailTo, $this->user->name)->subject($this->user->email_message);
            $message->from(env('MAIL_FROM_ADDRESS'));
        });
    }
}
