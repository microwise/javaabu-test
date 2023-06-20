<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Articles extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$assets = [
			'css' => ['list'],
			'js' => [],
		];
		$this->load->view('templates/head',$assets);
		$this->load->view('articles/list');
		$this->load->view('templates/foot');
	}

	public function view($item) {
		$assets = [
			'css' => ['view'],
			'js' => [],
		];
		$this->load->view('templates/head',$assets);
		$this->load->view('articles/view');
		$this->load->view('templates/foot');
	}
}
