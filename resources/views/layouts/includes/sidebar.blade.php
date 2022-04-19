<nav class="pcoded-navbar {{ getThemeClass('navbar') }}">
    <div class="navbar-wrapper">
        <div class="navbar-brand header-logo">
            <a href="{{ url('dashboard') }}" class="b-brand">

                <span class="b-title" title="{{ 'NFT of The Day' }}">{{ 'NFT of The Day' }}</span>
            </a>
            <a class="mobile-menu" id="mobile-collapse" href="javascript:"><span></span></a>
        </div>
        <div class="navbar-content scroll-div">
            <ul class="nav pcoded-inner-navbar">
                <li class="nav-item pcoded-menu-caption">
                    <label>{{ __('NAVIGATION') }}</label>
                </li>

                <li data-username="dashboard" class="nav-item {{ $menu == 'Admins' ? 'active' : '' }}">
                    <a href="{{ url('/admin/list') }}" class="nav-link "><span class="pcoded-micon"><i class="feather icon-users"></i></span><span class="pcoded-mtext">{{ __('Admins') }} </span></a>
                </li> 
                <li data-username="skripsi" class="nav-item pcoded-hasmenu {{ $menu == 'promotions' ? 'pcoded-trigger active' : '' }}">                    
                    <a href="javascript:" class="nav-link "><span class="pcoded-micon"><i class="feather icon-clipboard"></i></span><span class="pcoded-mtext">{{ __('NFT Promotion') }}</span></a>
                    <ul class="pcoded-submenu">
                        <li class="{{ isset($sub_menu) && $sub_menu == 'create_promotion' ? 'active' : '' }}"><a href="{{ url('promotion/create
                            ') }}" class="">{{ __('Create Promotion') }}</a></li>
                        <li class="{{ isset($sub_menu) && $sub_menu == 'promotion_list' ? 'active' : '' }}"><a href="{{ url('promotion/list') }}" class="">{{ __('List Promotions') }}</a></li>
                    </ul>
                </li>  
                <li data-username="app" class="nav-item pcoded-hasmenu {{ $menu == 'app' ? 'pcoded-trigger active' : '' }}">   
                    <a href="javascript:" class="nav-link "><span class="pcoded-micon"><i class="feather icon-layers"></i></span><span class="pcoded-mtext">{{ __('Application Content') }} </span></a>
                    <ul class="pcoded-submenu">
                        <li class="{{ isset($sub_menu) && $sub_menu == 'blockchains' ? 'active' : '' }}"><a href="{{ url('blockchain/list') }}" class="">{{ __('Blockchains') }}</a></li>
                        <li class="{{ isset($sub_menu) && $sub_menu == 'wallets' ? 'active' : '' }}"><a href="{{ url('wallet/list') }}" class="">{{ __('Wallets') }}</a></li>
                        <li class="{{ isset($sub_menu) && $sub_menu == 'faq' ? 'active' : '' }}"><a href="{{ url('faq/list') }}" class="">{{ __('FAQs') }}</a></li>
                        <li class="{{ isset($sub_menu) && $sub_menu == 'faq2' ? 'active' : '' }}"><a href="{{ url('guidelines/list') }}" class="">{{ __('Guidelines') }}</a></li>
                    </ul>
                </li> 
                          
            </ul>
                </li><br><br>
                
            </ul>
        </div>
    </div>
</nav>
