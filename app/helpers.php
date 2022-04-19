<?php

use App\Models\Preference;

    function getThemeClass($tagName = null)
    {
        $cssClass = "";
        if (empty($tagName)) {
            return $cssClass;
        }
    
        $themePreferences = Preference::getAll()->where('field', 'theme_preference')->where('category', 'preference')->first();
        $themePreferences = !empty($themePreferences['value']) ? json_decode($themePreferences['value'], true) : '';
    
        if (!is_array($themePreferences)) {
            return $cssClass;
        }
    
        foreach ($themePreferences as $key => $value) {
            if ($value == 'default') {
                $data[$key] = '';
            } else {
                $data[$key] = $value;
            }
        }
    
        if ($tagName == 'header') {
            $cssClass = (!empty($data['header_background']) ? $data['header_background'] : '') . ' ' . (!empty($data['header-fixed']) ? $data['header-fixed'] : '');
            return $cssClass;
        } 
    
        if ($tagName == 'body') {
            $cssClass = !empty($themePreferences['box-layout']) ? $themePreferences['box-layout'] : '';
            return $cssClass;
        }
    
        if ($tagName == 'navbar') {
            $cssClass = (!empty($data['theme_mode']) ? $data['theme_mode'] : 'pcoded-navbar' . ' ') .
            (!empty($data['menu_brand_background']) ? $data['menu_brand_background'] : '') . ' ' .
            (!empty($data['menu_background']) ? $data['menu_background'] : '') . ' ' .
            (!empty($data['menu_item_color']) ? $data['menu_item_color'] : '') . ' ' .
            (!empty($data['navbar_image']) ? $data['navbar_image'] : '') . ' ' .
            (!empty($data['menu-icon-colored']) ? $data['menu-icon-colored'] : '') . ' ' .
            (!empty($data['menu-fixed']) ? $data['menu-fixed'] : '') . ' ' .
            (!empty($data['menu_list_icon']) ? $data['menu_list_icon'] : '') . ' ' .
            (!empty($data['menu_dropdown_icon']) ? $data['menu_dropdown_icon'] : '');
            return $cssClass;
        }
    
        if ($tagName == 'theme-mode') {
            $cssClass = !empty($themePreferences['theme_mode']) ? $themePreferences['theme_mode'] : '';
            return $cssClass;
        }
    
        return $cssClass;
    }


    function getUserProfilePicture()
{
    $image = url("dist/img/avatar.jpg");   
    return $image;
}

function weblogo()
{
    $image = url("dist/img/Logo.png");   
    return $image;
}

function stripBeforeSave($string = null, $options = ['skipAllTags' => true, 'mergeTags' => false]) 
{
    $finalString = [];
    if ($options['skipAllTags'] === false) {
        $allow = '<h1><h2><h3><h4><h5><h6><p><b><br><hr><i><pre><small><strike><strong><sub><sup><time><u><form><input><textarea><button><select><option><label><frame><iframe><img><audio><video><a><link><nav><ul><ol><li><table><th><tr><td><thead><tbody><div><span><header><footer><main><section><article>';
        if (isset($options['mergeTags']) && $options['mergeTags'] === true && isset($options['allowedTags'])) {
            $allow .= is_array($options['allowedTags']) ? implode('',) : trim($options['allowedTags']);
        } else {
            $allow = isset($options['allowedTags']) && is_array($options['allowedTags']) ? implode('', $options['allowedTags']) : trim($options['allowedTags']);
        }
        if (is_array($string)) {
            foreach ($string as $key => $value) {
                $finalString[$key] = strip_tags($value, $allow);
            }
        } else {
            $finalString = strip_tags($string, $allow);
        }
    } else {
        if (is_array($string)) {
            foreach ($string as $key => $value) {
                $finalString[$key] = strip_tags($value);
            }
        } else {
            $finalString = strip_tags($string);
        }
    }
    return !empty($finalString) ? $finalString : null;
}

function checkFileValidationOne($ext)
{
    return in_array($ext, getFileExtensions()) ? true : false;
}


function getFileExtensions($type = 0)
{
    $extensions = array(
        0 => ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'pdf'],
        1 => ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'pdf'],
        2 => ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
    );
    return $extensions[$type];
}

function getFileIcon($file = null)
{
    if (empty($file)) {
        return null;
    }

    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    switch ($ext) {
        case 'docx':
        case 'doc':
            return 'far fa-file-word';
            break;
        case 'pdf':
            return 'far fa-file-pdf';
            break;
        case 'xlsx':
        case 'xls':
        case 'csv':
            return 'far fa-file-excel';
            break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'far fa-image';
            break;
        default:
            return 'far fa-file';
    }
}


function maxFileSize($fileSize)
{
    $data = [];
    $maxfileSize = 50;
    if (isset($maxfileSize) && !empty($maxfileSize)) {
        $maxFileSize = (int) $maxfileSize;
        if (($fileSize / 1024) <= $maxfileSize * 1024) {
            $data['status'] = 1;
        } else if (($fileSize / 1024) > $maxfileSize * 1024) {
            $data['status'] = 0;
            $data['message'] = __('Maximum File Size :? MB.', ['?' => $maxfileSize]);
        }
        return $data;
    }
}


?>
