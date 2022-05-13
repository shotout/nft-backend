<?php 

namespace App\Handler;

use App\Models\Blockchain;
use App\Models\Faq;
use App\Models\Wallet;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Spatie\WebhookClient\ProcessWebhookJob;
use Intervention\Image\Facades\Image;
use Contentful\RichText\Node\NodeInterface;
use Contentful\RichText\RendererInterface;
use Contentful\Delivery\Client as DeliveryClient;


class WebhookHandler extends ProcessWebhookJob
{

    public function handle( DeliveryClient $client)
    {
        $data  = $this->webhookCall->payload;

        if($data['type'] == 'Entry')
            {

                if($data['ContentType'] == 'wallets')
                    {
                        logger('Store Data');
                        $data  = $this->webhookCall->payload;  
                        logger($data); 
                        $logoname = $data['logo'];
                        
                        $response = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                        
                        
                        $imagelink = 'Https:'.$response['fields']['file']['url'];
                        $imagename = $response['fields']['file']['fileName'];

                        logger($imagelink);                        

                        $path = $imagelink;


                        Image::make($path)->save('storage/wallet_logo/'.$imagename);

                        $dir = createDirectory("storage/wallet_logo/thumbnail/");
                        $destination_path = 'storage/wallet_logo/';
                        $new_path = 'storage/wallet_logo/thumbnail/';
                        copy($destination_path.$imagename, $new_path.$imagename);
                        
                        $save = new Wallet();
                        $save->uuid = $data['entityId'];
                        $save->image = $destination_path.$imagename;
                        $save->name = $data['name'];
                        $save->created_at = date('Y-m-d H:i:s');
                        $save->save();
                    }


                if($data['ContentType'] == 'blockchains')
                    {
                        logger('Store Data');
                        $data  = $this->webhookCall->payload;  
                        logger($data); 
                        $logoname = $data['vektor'];
                        
                        $response = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                        
                        
                        $imagelink = 'Https:'.$response['fields']['file']['url'];
                        $imagename = $response['fields']['file']['fileName'];

                        logger($imagelink);                        

                        $path = $imagelink;


                        Image::make($path)->save('storage/blockchain_logo/'.$imagename);

                        $dir = createDirectory("storage/blockchain_logo/thumbnail/");
                        $destination_path = 'storage/blockchain_logo/';
                        $new_path = 'storage/blockchain_logo/thumbnail/';
                        copy($destination_path.$imagename, $new_path.$imagename);
                        
                        $save = new Blockchain();
                        $save->uuid = $data['entityId'];
                        $save->vektor = $destination_path.$imagename;
                        $save->abbreviation = $data['abbreviation'];
                        $save->name = $data['name'];

                        $save->created_at = date('Y-m-d H:i:s');
                        $save->save();
                    }

                    if($data['ContentType'] == 'faqs')
                    {
                        logger('Store Data');
                        $data  = $this->webhookCall->payload;  
                        // logger($data);
                        $this->client = $client;
                        $entry = $client->getEntry($data['entityId']);

                        $asnwer1 = $entry->answer;

                        $renderer = new \Contentful\RichText\Renderer();
                        $asnwer = $renderer->render($asnwer1);
                      

                        $find = Faq::where('uuid',$data['entityId'])->first();

                       

                        if($entry->parent != null)
                        {
                            $findparent = Faq::where('question', $entry->parent['question'])->first();
                            $findparent = $findparent->id;
                        }
                        else
                        {
                            $findparent = null;
                        }
                        
                        

                        if($find)
                            {
                                $find->delete();
                            }

                        $save = new Faq();
                        $save->uuid = $data['entityId'];
                        $save->question = $entry->question;
                        $save->answer = $asnwer;
                        $save->parent = $findparent;
                        $save->flag = $entry->flag;
                        $save->created_at = date('Y-m-d H:i:s');
                        $save->save();

                    }
            }

        if($data['type'] == 'DeletedEntry')
            {
                if($data['ContentType'] == 'wallets')
                    {
                        logger('Delete Data');
                        $data  = $this->webhookCall->payload;
                        logger($data); 

                        $delete = Wallet::where('uuid', $data['entityId'])->first();

                        File::delete($delete->image);

                        $delete->delete();
                    }

                if($data['ContentType'] == 'blockchains')
                    {
                        logger('Delete Data');
                        $data  = $this->webhookCall->payload;
                        logger($data); 

                        $delete = Blockchain::where('uuid', $data['entityId'])->first();

                        File::delete($delete->vektor);

                        $delete->delete();
                    }

                if($data['ContentType'] == 'faqs')
                    {
                        logger('Delete Data');
                        $data  = $this->webhookCall->payload;
                        logger($data); 

                        $delete = Faq::where('uuid', $data['entityId'])->first();

                        $delete->delete();
                    }
                
            }


    }
}