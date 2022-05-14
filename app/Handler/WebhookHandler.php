<?php 

namespace App\Handler;

use App\Models\AppPreferance;
use App\Models\Blockchain;
use App\Models\Faq;
use App\Models\Product;
use App\Models\Wallet;
use Contentful\Core\Api\LinkResolverInterface;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Spatie\WebhookClient\ProcessWebhookJob;
use Intervention\Image\Facades\Image;
use Contentful\RichText\Node\NodeInterface ;
use Contentful\RichText\RendererInterface;
use Contentful\Delivery\Client as DeliveryClient;
use Contentful\Delivery\LinkResolver;
use Contentful\RichText\Parser;
use Ramsey\Uuid\Uuid;

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

                        $find = Wallet::where('uuid',$data['entityId'])->first();
                        if($find)
                            {
                                $find->delete();
                            }
                        
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

                        $find = Blockchain::where('uuid',$data['entityId'])->first();
                        if($find)
                            {
                                $find->delete();
                            }
                        
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
                        
                        $this->client = $client;
                        $entry = $client->getEntry($data['entityId']);

                        $asnwer1 = $entry->answer;

                        $renderer = new \Contentful\RichText\Renderer();
                        $asnwer = $renderer->render($asnwer1);                                            

                       

                        if($entry->parent != null)
                        {
                            $findparent = Faq::where('question', $entry->parent['question'])->first();
                            $findparent = $findparent->id;
                        }
                        else
                        {
                            $findparent = null;
                        }
                        
                        
                        $find = Faq::where('uuid',$data['entityId'])->first();
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

                if($data['ContentType'] == 'products')
                    {
                        logger('Store Data');
                        $data  = $this->webhookCall->payload;  
                        
                        $this->client = $client;
                        $entry = $client->getEntry($data['entityId']);

                        $description1 = $entry->description;
                        $community1 = $entry->community;

                        $renderer = new \Contentful\RichText\Renderer();
                        $description = $renderer->render($description1);                                            
                        $community = $renderer->render($community1);
                       
                      
                       
                        $find = Product::where('uuid',$data['entityId'])->first();
                        if($find)
                            {
                                $find->delete();
                                $theme = AppPreferance::where('product_id',$find->id)->first();
                                $theme->delete();

                            }

                        $blockchain = Blockchain::where('name',$entry->blockchain['name'])->first();
                        $blockchain = $blockchain->id;

                        $save = new Product();
                        $save->uuid = $data['entityId'];
                        $save->nft_title = $entry->title;
                        $save->nft_type =$entry->hype;
                        $save->nft_price = $entry->price;
                        $save->nft_mint = $entry->mint;
                        $save->nft_amount = $entry->amount;
                        $save->nft_description = $description;
                        $save->nft_community = $community;
                        $save->nft_publish_date = $entry->publish_date;
                        $save->nft_blockchain = $blockchain;
                        $save->nft_exp_promo = $entry->exp_promo;
                        $save->is_verified = $entry->is_verified;
                        $save->created_at = date('Y-m-d H:i:s');
                        $save->save();
                        
                        $product_id = Product::latest()->first();
                        $product_id = $product_id->id;

                        $theme = new AppPreferance();
                        $theme->uuid = Uuid::uuid4();
                        $theme->product_id = $product_id;
                        $theme->main_color = $entry->mainColor;
                        $theme->background_color = $entry->backgroundColor;
                        $theme->gradient1_color = $entry->gradient1Color;;    
                        $theme->gradient2_color = $entry->gradient2Color;
                        $theme->save();
                        
                        
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

                if($data['ContentType'] == 'products')
                    {
                        logger('Delete Data');
                        $data  = $this->webhookCall->payload;
                        logger($data); 

                        $delete = Product::where('uuid', $data['entityId'])->first();

                        $delete->delete();

                        $theme = AppPreferance::where('product_id',$delete->id)->first();
                        $theme->delete();
                    }
                
            }


    }
}