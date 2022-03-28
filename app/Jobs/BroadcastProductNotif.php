<?php

namespace App\Jobs;

use App\Models\User;
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
            $firebaseToken = User::whereNotNull('fcm_token')->pluck('fcm_token')->all();
          
            $SERVER_API_KEY = "AAAADoXPA1I:APA91bFH-rUX_fHzb7Py85TkPE2w5aI72lp4E6cJyiEjk04pGFwhSny_3pv-rh-PHtYXxHlu0BBFROTshP2Z7dN11vslUHl8OPUHnA-HxAQwpCTYQnglZaUhKSG5mozkuzXc_6wfU93v";
    
            $data = [
                "registration_ids" => $firebaseToken,
                "notification" => [
                    "title" => 'test title',
                    "body" => 'test body',  
                ]
            ];

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
