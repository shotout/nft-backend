<?php

namespace App\Http\Controllers;

use App\Models\Admins;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{ 

   public function index(){
        return view('auth.login');
   }
   
    public function authenticate(Request $request)
    {        
        $this->validate($request, [
            'email' => 'required|email|exists:admins',
            'password' => 'required']);

        $userData = Admins::where(['email' => $request->email])->first();
        if ($userData['is_active'] == 0) {
            return back()->withInput()->withErrors(['email' => "Inactive User"]);
        } 
        $data = $request->only('email', 'password');
        if (Auth::guard('web')->attempt($data)) {

            if (! is_null($request->remember)) {
                $ckkey = encrypt($this->ckname.Auth::user()->id.".user");
                Cookie::queue($this->ckname, $ckkey, 2592000);
            }
            return redirect()->intended('admin/list');
        }
        return back()->withInput()->withErrors(['email' => __("Invalid email or password")]);
    }

    public function logout()
    {
        if(Cookie::has($this->ckname)){
            $cookie = Cookie::forget($this->ckname);
        }
       
        Auth::guard('web')->logout();
        Session::flush();
        return redirect('/')->withCookie($cookie);
    }

    /**
     * forget password
     *
     * @return forget password form
     */
    public function reset(Request $request)
    {
        $this->data = ['page_title' => __('Reset Password')];
        return view('auth.passwords.email', $this->data);
    }

    /**
     * Send reset password link
     *
     * @return Null
     */
    public function sendResetLinkEmail(Request $request)
    {
        $cek = Admins::where('email',$request->email)->count();
        if($cek == 1)
        {
            return view ('auth.passwords.reset');
        }
        else
        {
            Session::flash('fail', __('Email Not Registered'));
            return redirect()->intended('/password/reset');
        }
    }

   
    
}
