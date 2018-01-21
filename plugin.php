<?php
/*
Plugin Name: JUNN Steemit & Wordpress Sync
Plugin URI: https://github.com/junn279/junn-steemit-wordpress-sync
Description: Get Steem Posts to Wordpress using Steem API.
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
		$target_id = $instance['target_id'];
		$template_permlink = $instance['template_permlink'];
		$title = apply_filters( 'widget_title', $instance[ 'title' ] );
		$blog_title = get_bloginfo( 'name' );
		$tagline = get_bloginfo( 'description' );
		echo $args['before_widget'] . $args['before_title'] . $title . $args['after_title'];

		$view_name = "jsws_status_view";
		/*<p><strong>Search Type:</strong> <?php echo $search_option ?></p>
		<p><strong>Keyword:</strong> <?php echo $keyword ?></p>
		<p><strong>Count:</strong> <?php echo $nrow ?></p>*/
		?>
		<p><div id="<?=$view_name?>" style="width:100%;"><img style="width:50px;height:50px;" src="<?=plugins_url('img/giphy.gif',__FILE__)?>"/></div></p>
		<?php 
		
		$translation_array = array(
			'target_id' => $target_id,
			'status_view' => $view_name,
			'template_permlink' => home_url()."/".$template_permlink,
			'giphy_url'=> plugins_url("img/giphy.gif",__FILE__),
			'null_image_url' => plugins_url("img/mediteam.png",__FILE__)

		);
		wp_enqueue_script('jsws-main-js',plugins_url('js/script.js',__FILE__));
		wp_localize_script('jsws-main-js', 'args', $translation_array );

		?>
		 <?php echo $args['after_widget'];
	}

	public function form( $instance ) 							//Appearnce -> Widget -> Setting에서 보이는 부분
	{
	  $title = ! empty( $instance['title'] ) ? $instance['title'] : ''; 
	  $target_id = ! empty( $instance['target_id'] ) ? $instance['target_id'] : '';
	  $template_permlink = ! empty( $instance['template_permlink'] ) ? $instance['template_permlink'] : ''; 
	  ?>
	  <p>
	    <label for="<?php echo $this->get_field_id( 'title' ); ?>">Title:</label>
	    <input type="text" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo esc_attr( $title ); ?>" />
	  </p>
	  <p>
	    <label for="<?php echo $this->get_field_id( 'target_id' ); ?>">ID :</label>
	    <input type="text" id="<?php echo $this->get_field_id( 'target_id' ); ?>" name="<?php echo $this->get_field_name( 'target_id' ); ?>" value="<?php echo esc_attr( $target_id ); ?>" />
	  </p>
	   <p>
	    <label for="<?php echo $this->get_field_id( 'template_permlink' ); ?>">Template Page Permlink :</label>
	    <input type="text" id="<?php echo $this->get_field_id( 'template_permlink' ); ?>" name="<?php echo $this->get_field_name( 'template_permlink' ); ?>" value="<?php echo esc_attr( $template_permlink ); ?>" />
	  </p>
	  <?php 
	}
	public function update( $new_instance, $old_instance ) //Appearnce -> Widget -> Setting -> Click Save Button
	{
  		$instance = $old_instance;
  		$instance[ 'title' ] = strip_tags( $new_instance[ 'title' ] );
  		$instance[ 'target_id' ] = strip_tags( $new_instance[ 'target_id' ] );
  		$instance[ 'template_permlink' ] = strip_tags( $new_instance[ 'template_permlink' ] );
  		
  		return $instance;
	}
}

	
function jsws_load_steemjs() {
	//js 파일 추
	
	
	wp_enqueue_script('jsws_include-steem-js', '//cdn.steemjs.com/lib/latest/steem.min.js');
	wp_enqueue_script('jsws_showdown-js', '//cdn.rawgit.com/showdownjs/showdown/1.7.3/dist/showdown.min.js');	
	wp_enqueue_script('jsws_dateformat-js', plugins_url('js/date.format.js',__FILE__));	
	wp_enqueue_script('jsws_notify_js', plugins_url('js/notify.min.js',__FILE__),array( 'jquery' ));
}

add_action( 'wp_enqueue_scripts', 'jsws_load_steemjs' );

function jsws_register_my_widget() { 
  register_widget( 'junn_steemit_wordpress_sync' );	//Save as [Class Name]
}
add_action( 'widgets_init', 'jsws_register_my_widget' );	//Don`t change

?>