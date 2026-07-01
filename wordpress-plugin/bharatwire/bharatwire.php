<?php
/**
 * Plugin Name: BharatWire News Sync
 * Description: Pulls licensed news from your BharatWire subscription into WordPress (as drafts by default).
 * Version: 0.1.0
 * Author: BharatWire
 */

if (!defined('ABSPATH')) exit; // no direct access

/* ------------------------------------------------------------------ */
/*  Settings                                                          */
/* ------------------------------------------------------------------ */
add_action('admin_menu', function () {
    add_options_page('BharatWire', 'BharatWire', 'manage_options', 'bharatwire', 'bw_settings_page');
});

add_action('admin_init', function () {
    register_setting('bw_group', 'bw_api_url');
    register_setting('bw_group', 'bw_api_key');
    register_setting('bw_group', 'bw_status'); // draft | publish
});

function bw_settings_page() {
    if (!current_user_can('manage_options')) return;

    // Handle "Sync now"
    $notice = '';
    if (isset($_POST['bw_sync']) && check_admin_referer('bw_sync_action')) {
        $notice = bw_sync_now();
    }

    $url    = esc_attr(get_option('bw_api_url', ''));
    $key    = esc_attr(get_option('bw_api_key', ''));
    $status = esc_attr(get_option('bw_status', 'draft'));
    ?>
    <div class="wrap">
        <h1>BharatWire News Sync</h1>
        <?php if ($notice) echo '<div class="notice notice-info"><p>' . esc_html($notice) . '</p></div>'; ?>

        <form method="post" action="options.php">
            <?php settings_fields('bw_group'); ?>
            <table class="form-table">
                <tr>
                    <th>BharatWire URL</th>
                    <td><input type="text" name="bw_api_url" value="<?php echo $url; ?>"
                        class="regular-text" placeholder="https://your-bharatwire-site.com" /></td>
                </tr>
                <tr>
                    <th>API key</th>
                    <td><input type="text" name="bw_api_key" value="<?php echo $key; ?>"
                        class="regular-text" placeholder="bw_live_..." /></td>
                </tr>
                <tr>
                    <th>Import as</th>
                    <td>
                        <select name="bw_status">
                            <option value="draft"   <?php selected($status, 'draft'); ?>>Draft (review before publishing)</option>
                            <option value="publish" <?php selected($status, 'publish'); ?>>Publish immediately</option>
                        </select>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save settings'); ?>
        </form>

        <hr />
        <form method="post">
            <?php wp_nonce_field('bw_sync_action'); ?>
            <input type="hidden" name="bw_sync" value="1" />
            <?php submit_button('Sync news now', 'primary'); ?>
        </form>
    </div>
    <?php
}

/* ------------------------------------------------------------------ */
/*  Sync: pull licensed articles → create WP posts                    */
/* ------------------------------------------------------------------ */
function bw_sync_now() {
    $base = rtrim(get_option('bw_api_url', ''), '/');
    $key  = get_option('bw_api_key', '');
    $status = get_option('bw_status', 'draft');
    if (!$base || !$key) return 'Please set the URL and API key first.';

    $res = wp_remote_get($base . '/api/v1/articles?limit=20', array(
        'headers' => array('x-api-key' => $key),
        'timeout' => 30,
    ));
    if (is_wp_error($res)) return 'Error: ' . $res->get_error_message();

    $code = wp_remote_retrieve_response_code($res);
    if ($code !== 200) return 'API returned HTTP ' . $code . ' (check your key/URL).';

    $data = json_decode(wp_remote_retrieve_body($res), true);
    if (empty($data['articles'])) return 'No licensed articles available.';

    $created = 0; $skipped = 0;
    foreach ($data['articles'] as $a) {
        // Skip if we already imported this BharatWire article.
        $existing = get_posts(array(
            'post_type'  => 'post',
            'meta_key'   => '_bw_article_id',
            'meta_value' => $a['id'],
            'fields'     => 'ids',
            'numberposts'=> 1,
        ));
        if ($existing) { $skipped++; continue; }

        $content = '';
        if (!empty($a['coverImage'])) {
            $content .= '<img src="' . esc_url($a['coverImage']) . '" alt="" /><br/>';
        }
        $content .= wpautop(esc_html($a['body']));
        if (!empty($a['sourceUrl'])) {
            $content .= '<p><small>Source: <a href="' . esc_url($a['sourceUrl']) . '">link</a></small></p>';
        }
        $content .= '<p><small>Licensed via BharatWire</small></p>';

        $post_id = wp_insert_post(array(
            'post_title'   => sanitize_text_field($a['title']),
            'post_content' => $content,
            'post_excerpt' => sanitize_text_field($a['excerpt']),
            'post_status'  => $status,
            'post_category'=> array(bw_get_category_id($a['category'])),
        ));

        if ($post_id && !is_wp_error($post_id)) {
            update_post_meta($post_id, '_bw_article_id', $a['id']);
            $created++;
        }
    }
    return "Sync done: $created imported, $skipped already existed.";
}

function bw_get_category_id($name) {
    $term = term_exists($name, 'category');
    if (!$term) $term = wp_insert_term($name, 'category');
    return is_array($term) ? (int)$term['term_id'] : 0;
}
