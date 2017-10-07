<?php
/*
Plugin Name: JUNN Steemit & Wordpress Sync
Plugin URI: https://github.com/junn279/junn-steemit-latest-posts
Description: Bagic Latest Posts using Steem API.
Version: 1.0
Author: Junn
Author URI: http://junn.in
License: Feel free to copy, modify and distribute
*/

class junn_steemit_wordpress_sync extends WP_Widget {

	public function __construct() 
	{
		$widget_title = "JUNN Steemit Wordpress Sync";				//Appearance -> Widget name
	    $widget_options = array( 
	      'classname' => 'junn_steemit_wordpress_sync',					//class name, not visible?
	      'description' => 'Synchronize Status',	//Appearance -> Widget Description
	    );
	    parent::__construct( 'junn_steemit_wordpress_sync', $widget_title, $widget_options );
	}

	public function widget( $args, $instance ) 					//Contents of View(실제 화면)
	{
		$title = apply_filters( 'widget_title', $instance[ 'title' ] );
		$blog_title = get_bloginfo( 'name' );
		$tagline = get_bloginfo( 'description' );
		echo $args['before_widget'] . $args['before_title'] . $title . $args['after_title'];

		/*<p><strong>Search Type:</strong> <?php echo $search_option ?></p>
		<p><strong>Keyword:</strong> <?php echo $keyword ?></p>
		<p><strong>Count:</strong> <?php echo $nrow ?></p>*/
		?>
		<p><div id="jslp_sync_view" style="width:100%;"><img style="width:50px;height:50px;" src="<?=plugins_url('img/giphy.gif',__FILE__)?>"/></div></p>
		<?php 
		/*
		$translation_array = array(
			'query_tag' => $query_tag,
			'no_profile_image' => plugins_url("img/no-profile.png",__FILE__),
			'nrow' => $nrow
		);
		*/
		wp_enqueue_script('jslp-steem-js',plugins_url('js/script.js',__FILE__));
		//wp_localize_script('jslp-steem-js', 'args', $translation_array );
		?>
		 <?php echo $args['after_widget'];
	}

	public function form( $instance ) 							//Appearnce -> Widget -> Setting에서 보이는 부분
	{
	  $title = ! empty( $instance['title'] ) ? $instance['title'] : ''; ?>
	  <p>
	    <label for="<?php echo $this->get_field_id( 'title' ); ?>">Title:</label>
	    <input type="text" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo esc_attr( $title ); ?>" />
	  </p>
	  
	  <?php 
	}
	public function update( $new_instance, $old_instance ) 		//Appearnce -> Widget -> Setting -> Click Save Button
	{
  		$instance = $old_instance;
  		$instance[ 'title' ] = strip_tags( $new_instance[ 'title' ] );
  		/*$instance[ 'search_option'] = strip_tags( $new_instance ['search_option']);
  		$instance[ 'keyword'] = strip_tags( $new_instance ['keyword']);
  		$num = strip_tags( $new_instance ['nrow']);
  		if($num > 20)$num = 20;
  		if($num < 0)$num = 1;
  		$instance[ 'nrow'] = $num;*/
  		return $instance;
	}
}

	
function jslp_load_steemjs() {
	//js 파일 추
	wp_enqueue_script('include-steem-js', '//cdn.steemjs.com/lib/latest/steem.min.js');
	wp_enqueue_script('showdown-js', '//cdn.rawgit.com/showdownjs/showdown/1.7.3/dist/showdown.min.js');	
	wp_enqueue_script('dateformat-js', plugins_url('js/date.format.js',__FILE__));	
	wp_enqueue_script('notify_js', plugins_url('js/notify.min.js',__FILE__))
}

add_action( 'wp_enqueue_scripts', 'jslp_load_steemjs' );

function jslp_register_my_widget() { 
  register_widget( 'junn_steemit_wordpress_sync' );	//Save as [Class Name]
}
add_action( 'widgets_init', 'jslp_register_my_widget' );	//Don`t change

?>