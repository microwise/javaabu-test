<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Articles extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$db = $this->load->database();
	}

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
