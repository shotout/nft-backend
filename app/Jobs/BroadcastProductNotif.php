<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
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
        // $now = \Carbon\Carbon::now()->toDateTimeString(); 

        $product = Product::whereDate('nft_publish_date', now())
            ->whereTime('nft_publish_date', '<=', $now)
            ->where('has_notif', false)
            ->first();
        Log::info($product);

        if ($product) {
            // broadcast notif to firebase
            $firebaseToken = User::whereNotNull('fcm_token')->pluck('fcm_token')->all();

            // update counter notif user
            User::whereNotNull('fcm_token')->increment('notif_count', 1);
          
            $SERVER_API_KEY = env('FIREBASE_SERVER_API_KEY');

            $desc = strip_tags($product->nft_description);
            $descShort = substr($desc, 0, 100);
    
            $data = [
                "registration_ids" => $firebaseToken,
                "notification" => [
                    "title" => $product->nft_title,
                    "body" => $descShort,  
                    "icon" => 'https://nftdaily.app/assets/logo/logo.png',
                    "image" => 'https://backend.nftdaily.app/'.$product->collections[0]->image
                ]
            ];

            Log::info($data);

            $dataString = json_encode($data);
        
            $headers = [
                'Authorization: key=' . $SERVER_API_KEY,
                'Content-Type: application/json',
            ];
        
            $ch = curl_init();
      
            curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
                
            $response = curl_exec($ch);
            Log::info($response);

            // update status
            $product->has_notif = true;
            $product->update();

            // create log if success
            Log::info('Job BroadcastProductNotif success running ...');
        }
    }
}
