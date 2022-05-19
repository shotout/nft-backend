<?php 

namespace App\Handler;

use App\Models\AppPreferance;
use App\Models\Blockchain;
use App\Models\Collections;
use App\Models\Communities;
use App\Models\Faq;
use App\Models\Product;
use App\Models\UserWatchlist;
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
use PhpOffice\PhpSpreadsheet\RichText\RichText;
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
                        $destination_path = 'storage/blockchain_logo/';
                       

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
                    
                        $logoname = $data['highlightNft'];
                        
                        $response = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');
                        
                        
                        
                        $imagelink = 'Https:'.$response['fields']['file']['url'];
                        $imagename = $response['fields']['file']['fileName'];

                        logger($imagelink);                        

                        $path = $imagelink;


                        Image::make($path)->save('storage/collection/'.$imagename);

                        $destination_path = 'storage/collection/';

                        
                        $this->client = $client;
                        $entry = $client->getEntry($data['entityId']);
                        

                        $description1 = $entry->description;
                        $community1 = $entry->community;

                        $renderer = new \Contentful\RichText\Renderer();
                        $description = $renderer->render($description1);                                            
                        $community = $renderer->render($community1);
                        
                        
                        $blockchain = Blockchain::where('name',$entry->blockchain['name'])->first();
                        $blockchain = $blockchain->id;
                      
                        $find = Product::where('uuid',$data['entityId'])->first();

                        $find2 = Product::where('uuid',$data['entityId'])->get();

                        if($find2->count() == 1)
                            {
                                $find2 = Product::where('uuid',$data['entityId'])->first();
                                $find2->nft_title = $entry->title;
                                $find2->nft_type =$entry->hype;
                                $find2->nft_price = $entry->price;
                                $find2->nft_mint = $entry->mint;
                                $find2->nft_amount = $entry->amount;
                                $find2->nft_description = $description;
                                $find2->nft_community = $community;
                                $find2->nft_publish_date = $entry->publish_date;
                                $find2->nft_blockchain = $blockchain;
                                $find2->nft_exp_promo = $entry->exp_promo;
                                $find2->is_verified = $entry->is_verified;
                                $find2->created_at = date('Y-m-d H:i:s');
                                $find2->save();

                                $updatetheme = AppPreferance::where('product_id',$find->id)->first();
                                $updatetheme->main_color = $entry->mainColor;
                                $updatetheme->background_color = $entry->backgroundColor;
                                $updatetheme->gradient1_color = $entry->gradient1Color;
                                $updatetheme->gradient2_color = $entry->gradient2Color;
                                $updatetheme->headline_color = $entry->headlineColor;
                                $updatetheme->badge_color = $entry->badgeColor;
                                $updatetheme->save();

                                $updatecommunities = Communities::where('product_id',$find->id)->first();
                                $updatecommunities->twitter = $entry->twitterUserLink;
                                $updatecommunities->discord = $entry->discordInvitationLink;
                                $updatecommunities->telegram = $entry->telegramUserLink;
                                $updatecommunities->instagram = $entry->instagramUserLink;
                                $updatecommunities->opensea = $entry->openSeaUserLink;
                                $updatecommunities->save();

                                $updatecollection = Collections::where('product_id',$find->id)->first();
                                $updatecollection->image = $destination_path.$imagename;
                                $updatecollection->type = 0;
                                $updatecollection->save();


                                Collections::where('product_id',$find->id)->where('type',1)->delete();


                                    if($data['collection1'])
                                        {
                                            $logoname1 = $data['collection1'];
                                    
                                            $response1 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname1.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink1 = 'Https:'.$response1['fields']['file']['url'];
                                            $imagename1 = $response1['fields']['file']['fileName'];
                    
                                            $path = $imagelink1;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename1);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $find->id;
                                            $collection->image = $destination_path.$imagename1;
                                            $collection->type = 1;
                                            $collection->save();
                                        }     
                                        
                                    if($data['collection2'])
                                        {
                                            $logoname2 = $data['collection2'];
                                    
                                            $response2 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname2.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink2 = 'Https:'.$response2['fields']['file']['url'];
                                            $imagename2 = $response2['fields']['file']['fileName'];
                    
                                            $path = $imagelink2;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename2);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $find->id;
                                            $collection->image = $destination_path.$imagename2;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 
                                    if($data['collection3'])
                                        {
                                            $logoname3 = $data['collection3'];
                                    
                                            $response3 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname3.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink3 = 'Https:'.$response3['fields']['file']['url'];
                                            $imagename3 = $response3['fields']['file']['fileName'];
                    
                                            $path = $imagelink3;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename3);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $find->id;
                                            $collection->image = $destination_path.$imagename3;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 
                                    if($data['collection4'])
                                        {
                                            $logoname4 = $data['collection4'];
                                    
                                            $response4 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname4.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink4 = 'Https:'.$response4['fields']['file']['url'];
                                            $imagename4 = $response4['fields']['file']['fileName'];
                    
                                            $path = $imagelink4;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename4);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $find->id;
                                            $collection->image = $destination_path.$imagename4;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 
                                    if($data['collection5'])
                                        {
                                            $logoname5 = $data['collection5'];
                                    
                                            $response5 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname5.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink5 = 'Https:'.$response5['fields']['file']['url'];
                                            $imagename5 = $response5['fields']['file']['fileName'];
                    
                                            $path = $imagelink5;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename5);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $find->id;
                                            $collection->image = $destination_path.$imagename5;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 

                            }

                        else {
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
                                    $theme->gradient1_color = $entry->gradient1Color;
                                    $theme->gradient2_color = $entry->gradient2Color;
                                    $theme->headline_color = $entry->headlineColor;
                                    $theme->badge_color = $entry->badgeColor;
                                    $theme->save();

                                    $communities = new Communities();
                                    $communities->uuid = Uuid::uuid4();
                                    $communities->product_id = $product_id;
                                    $communities->twitter = $entry->twitterUserLink;
                                    $communities->discord = $entry->discordInvitationLink;
                                    $communities->telegram = $entry->telegramUserLink;
                                    $communities->instagram = $entry->instagramUserLink;
                                    $communities->opensea = $entry->openSeaUserLink;
                                    $communities->save();

                                    $collection = new Collections();
                                    $collection->uuid = Uuid::uuid4();
                                    $collection->product_id = $product_id;
                                    $collection->image = $destination_path.$imagename;
                                    $collection->type = 0;
                                    $collection->save();

                                    logger($data['highlightNft']);    


                                    if($data['collection1'])
                                        {
                                            $logoname1 = $data['collection1'];
                                    
                                            $response1 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname1.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink1 = 'Https:'.$response1['fields']['file']['url'];
                                            $imagename1 = $response1['fields']['file']['fileName'];
                    
                                            $path = $imagelink1;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename1);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $product_id;
                                            $collection->image = $destination_path.$imagename1;
                                            $collection->type = 1;
                                            $collection->save();
                                        }     
                                        
                                    if($data['collection2'])
                                        {
                                            $logoname2 = $data['collection2'];
                                    
                                            $response2 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname2.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink2 = 'Https:'.$response2['fields']['file']['url'];
                                            $imagename2 = $response2['fields']['file']['fileName'];
                    
                                            $path = $imagelink2;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename2);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $product_id;
                                            $collection->image = $destination_path.$imagename2;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 
                                    if($data['collection3'])
                                        {
                                            $logoname3 = $data['collection3'];
                                    
                                            $response3 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname3.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink3 = 'Https:'.$response3['fields']['file']['url'];
                                            $imagename3 = $response3['fields']['file']['fileName'];
                    
                                            $path = $imagelink3;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename3);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $product_id;
                                            $collection->image = $destination_path.$imagename3;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 
                                    if($data['collection4'])
                                        {
                                            $logoname4 = $data['collection4'];
                                    
                                            $response4 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname4.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink4 = 'Https:'.$response4['fields']['file']['url'];
                                            $imagename4 = $response4['fields']['file']['fileName'];
                    
                                            $path = $imagelink4;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename4);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $product_id;
                                            $collection->image = $destination_path.$imagename4;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 
                                    if($data['collection5'])
                                        {
                                            $logoname5 = $data['collection5'];
                                    
                                            $response5 = Http::get('https://cdn.contentful.com/spaces/iekxawt54bzj/environments/master/assets/'.$logoname5.'?access_token=PnEziYatZ-FrHJ-vus9Uxry0gJNXMU2g0dd-EB2xKOQ');                    
                                                                    
                                            $imagelink5 = 'Https:'.$response5['fields']['file']['url'];
                                            $imagename5 = $response5['fields']['file']['fileName'];
                    
                                            $path = $imagelink5;
                    
                                            Image::make($path)->save('storage/collection/'.$imagename5);
                    
                                            $destination_path = 'storage/collection/';

                                            $collection = new Collections();
                                            $collection->uuid = Uuid::uuid4();
                                            $collection->product_id = $product_id;
                                            $collection->image = $destination_path.$imagename5;
                                            $collection->type = 1;
                                            $collection->save();
                                        } 
                             }

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
                        
                        if( UserWatchlist::all()->count() > 0 )
                            {
                                $user_watchlist = UserWatchlist::where('product_id', $delete->id)->get();
                                foreach($user_watchlist as $user_watchlist)
                                    {
                                        $user_watchlist->delete();
                                    }
                            }
                          
                        
                        $theme = AppPreferance::where('product_id',$delete->id)->first();
                        $theme->delete();

                        $communities = Communities::where('product_id',$delete->id)->first();
                        $communities->delete();

                        $collection = Collections::where('product_id',$delete->id)->delete();
                             

                        $delete->delete();
                    }
                
            }


    }
}