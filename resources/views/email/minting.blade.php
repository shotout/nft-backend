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

                                                <div style="Margin-left:10px;Margin-right:30px; margin-bottom:30px;">
                                                    <div style="margin-bottom:0px; border: 1px solid gray; border-radius: 15px; margin-left:3px; overflow: hidden;">
                                                        <div>
                                                            <a href="{{$product->nft_mint}}" target="_blank"><img src="{{'https://backend.nftdaily.app/'.$product->collections[0]->image}}" class="nft-preview"></a>

                                                            <h4 class="nft-title"><a href="{{$product->nft_mint}}" target="_blank"> {{$product->nft_title}}</a> </h4>
                                                            <form action = "{{$product->nft_mint}}" target="_blank">
                                                                <button class="mintbutton" type="submit"> MINT NOW </button>
                                                            </form>
                                                            
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


<style type="text/css">
    .mintbutton {

        background-color: #29AAE1;
        color: #ffffff;
        font-size: 16px;
        font-weight: 700;
        fill: #FFFFFF;
        line-height: 26.55px;
        padding: 3px 150px;
        text-align: center;
        margin-top: 15px;
        margin-left: 20px;
        margin-bottom: 10px;
        display: inline-block;
        border-radius: 7px;

    }

    .nft-preview {

        width: 100px;
        height: 100px;
        border-radius: 30px;
        margin-left: 15px;
        margin-right: 10px;
        margin-bottom: 10px;
        float: left;
        padding-bottom: 10px;
    }

    .nft-title {
        font-size: 16px;
        font-weight: 700;
        fill: #FFFFFF;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 5px;
    }
</style>

</html>