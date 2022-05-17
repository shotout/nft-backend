<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendConfirmEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;
    protected $flag;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, $flag)
    {
        $this->user = $user;
        $this->flag = $flag;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // send email verification
        if ($this->flag === 'register') {
            Mail::send('email.confirm', ['user' => $this->user, 'flag' => $this->flag], function($message) {
                $message->to($this->user->email, $this->user->name)->subject('NFT Daily Account Activation');
                $message->from(env('MAIL_FROM_ADDRESS'));
            });
        } else {
            Mail::send('email.confirm', ['user' => $this->user, 'flag' => $this->flag], function($message) {
                $message->to($this->user->email, $this->user->name)->subject('NFT Daily Sign In');
                $message->from(env('MAIL_FROM_ADDRESS'));
            });
        }
    }
}
