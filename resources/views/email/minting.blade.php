<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "https://www.w3.org/TR/html4/strict.dtd">
<html lang="en">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <title>{{$user->email_message}}</title>
</head>

<body>
    <div style="overflow: hidden;">
        <div style="margin:0;padding:0">
            <table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;table-layout:fixed;min-width:320px;width:100%;background-color:#f2f4f6">
                <tbody>
                    <tr>
                        <td>
                            <div role="section">
                                <div style="background-color:#ffffff">
                                    <div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);word-wrap:break-word;word-break:break-word">
                                        <div style="width: 100px;margin: 0 auto;">
                                            <a href="https://nftdaily.app/" target="_blank"><img src="https://backend.nftdaily.app/assets/logo/logo.png" style="margin-top: 50px;margin-bottom: 30%;width: 100%;text-align: center;"></a>
                                        </div>
                                        <div style="border-collapse:collapse;display:table;width:100%">
                                            <div style="max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);text-align:left;color:#111324;font-size:16px;line-height:24px;font-family:sans-serif">
                                                <div style="Margin-left:20px;Margin-right:20px">
                                                    <div style="line-height:20px;font-size:1px">
                                                        &nbsp;
                                                    </div>
                                                </div>
                                                <div style="Margin-left:20px;Margin-right:20px">
                                                    <div>
                                                        <p style="Margin-top:0;Margin-bottom:20px">Hi {{$user->name}},</p>
                                                    </div>
                                                </div>
                                                <div style="Margin-left:20px;Margin-right:20px">
                                                    <div style="line-height:1px;font-size:1px">
                                                        &nbsp;
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:#ffffff">
                                    <div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);word-wrap:break-word;word-break:break-word">
                                        <div style="border-collapse:collapse;display:table;width:100%">
                                            <div style="max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);text-align:left;color:#111324;font-size:16px;line-height:24px;font-family:sans-serif">
                                                <div style="Margin-left:15px;Margin-right:15px">
                                                    <div>
                                                        <p style="Margin-top:0;Margin-bottom:20px;color:#111324;">
                                                            You requested the link to mint <span style="font-weight: bold;">{{$product->nft_title}}</span> on NFT Daily. Click on the button below and <span style="font-weight: bold;">start minting before it’s too late!</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div style="Margin-left:10px;Margin-right:20px; margin-top:5px; margin-bottom:10px;">
                                                    <div style="margin-bottom:0px; border: 1px solid gray; border-radius: 15px; margin-left:3px; overflow: hidden;">
                                                        <div>
                                                            <a href="{{$product->nft_mint}}" target="_blank"><img src="{{'https://backend.nftdaily.app/'.$product->collections[0]->image}}" style="width: 100px; height: 100px; border-radius:15px; margin-left:15px; float: left; margin-right:10px; margin-bottom:10px; padding-bottom:5px;"></a>

                                                            <h4 style="padding-top:20px; font-size: 16px; font-weight: 700; fill: #FFFFFF; text-align:center;  margin-top: 20px; margin-bottom:10px; "><a style="color:#000000; text-decoration:none !important;" href="{{$product->nft_mint}}" target="_blank"> {{$product->nft_title}} </a> </h4>
                                                            <h3 style = "text-align:center; border-radius:4px; background-color:#29AAE1; color:#FFFFFF; padding:5px; font-size:14px; font-weight:bold;line-height:24px; margin-left:180px; margin-right:60px; margin-top:5px; " ><a style = "text-decoration:none !important; color:#FFFFFF;" href="{{$product->nft_mint}}" target="_blank">MINT NOW</a></h3>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>