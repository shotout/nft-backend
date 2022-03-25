<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class BroadcastProductNotif implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // find product
        $now = \Carbon\Carbon::now()->setTimezone('Asia/Jakarta')->toDateTimeString(); 
        $product = Product::whereDate('publish_date', now())
            ->whereTime('publish_date', '<=', $now)
            ->where('has_notif', false)
            ->first();

        if ($product) {
            // broadcast notif to firebase

            // update status
            $product->has_notif = true;
            $product->update();

            // create log if success
            Log::info('Job BroadcastProductNotif success running ...');
        }
    }
}
