<?php
/*
	Question2Answer by Gideon Greenspan and contributors
	http://www.question2answer.org/

	Description: Controller for top scoring users page


	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	More about this license: http://www.question2answer.org/license.php
*/

if (!defined('QA_VERSION')) { // don't allow this page to be requested directly from browser
	header('Location: ../../');
	exit;
}

require_once QA_INCLUDE_DIR . 'db/users.php';
require_once QA_INCLUDE_DIR . 'db/selects.php';
require_once QA_INCLUDE_DIR . 'app/format.php';


// Get list of all users

$start = qa_get_start();
$users = qa_db_select_with_pending(qa_db_top_users_selectspec($start, qa_opt_if_loaded('page_size_users')));

$usercount = qa_opt('cache_userpointscount');
$pagesize = qa_opt('page_size_users');
$users = array_slice($users, 0, $pagesize);
$usershtml = qa_userids_handles_html($users);


// Prepare content for theme

$qa_content = qa_content_prepare();

$qa_content['title'] = 'Test-Seite';
$qa_content['raw'] = '<div id="app">
    <div v-if="false">Wenn diese Meldung nicht innerhalb weniger Sekunden verschwindet, wird dieser Browser nicht unterstützt. Bitte aktualisieren Sie Ihren Browser und verwenden Sie eine aktuelle Version von Firefox, Chrome, Safari oder Mircosoft Edge.</div>
    <header v-cloak>
        <h1>Barrierefreiheit von Haushaltsgeräten</h1>
        <nav>
            <router-link to="/info">Startseite</router-link>
            <router-link to="/list">Erfasste Geräte</router-link>
            <router-link to="/new">Neues Gerät</router-link>
            <router-link to="/discussion">Diskussion</router-link>
            <router-link to="/login">Login</router-link>
        </nav>
    </header>
    <main v-cloak>
        <router-view :key="$route.path"></router-view>
    </main>
</div>
<script src="a11y-for-a8s.bundle.js"></script>';

return $qa_content;
