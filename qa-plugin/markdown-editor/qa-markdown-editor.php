<?php
/*
	Question2Answer Markdown editor plugin
	License: http://www.gnu.org/licenses/gpl.html
*/

class qa_markdown_editor
{
	private $pluginurl;
	private $cssopt = 'markdown_editor_css';
	private $convopt = 'markdown_comment';
	private $hljsopt = 'markdown_highlightjs';
	private $impuplopt = 'markdown_uploadimage';

	public function load_module($directory, $urltoroot)
	{
		$this->pluginurl = $urltoroot;
	}

	public function calc_quality($content, $format)
	{
		return $format == 'markdown' ? 1.0 : 0.8;
	}

	public function option_default($opt)
	{
		$defaults = [
			$this->cssopt => 0,
			$this->convopt => 1,
			$this->hljsopt => 0,
			$this->impuplopt => 0,
		];

		if (isset($defaults[$opt])) {
			return $defaults[$opt];
		}
	}

	public function get_field(&$qa_content, $content, $format, $fieldname, $rows, $autofocus)
	{
		$html = '<div id="wmd-button-bar-'.$fieldname.'" class="wmd-button-bar"></div>' . "\n";
		$html .= '<textarea name="'.$fieldname.'" id="wmd-input-'.$fieldname.'" class="wmd-input">'.$content.'</textarea>' . "\n";
		$html .= '<h3>'.qa_lang_html('markdown/preview').'</h3>' . "\n";
		$html .= '<div id="wmd-preview-'.$fieldname.'" class="wmd-preview"></div>' . "\n";

		$imageUploadUrl = qa_js(qa_path('qa-markdown-upload'));
		$uploadimg = (int) qa_opt($this->impuplopt);
		$html .= "<script>var image_upload_path=$imageUploadUrl; var image_upload_enabled=$uploadimg;</script>";

        // $html .= '<script src="'.$this->pluginurl.'pagedown/Markdown.Converter.js"></script>' . "\n";
        // $html .= '<script src="'.$this->pluginurl.'pagedown/Markdown.Sanitizer.js"></script>' . "\n";
        // $html .= '<script src="'.$this->pluginurl.'pagedown/Markdown.Editor.js"></script>' . "\n";

		// comment this script and uncomment the 3 above to use the non-minified code
    	$html .= '<script src="'.$this->pluginurl.'pagedown/markdown.min.js?v=2.6.2"></script>' . "\n";

		return array('type'=>'custom', 'html'=>$html);
	}

	public function read_post($fieldname)
	{
		$html = $this->_my_qa_post_text($fieldname);

		return array(
			'format' => 'markdown',
			'content' => $html
		);
	}

	public function load_script($fieldname)
	{
		return
			'var converter = Markdown.getSanitizingConverter();' . "\n" .
			'var editor = new Markdown.Editor(converter, "-'.$fieldname.'");' . "\n" .
			'editor.run();' . "\n";
	}


	// set admin options
	public function admin_form(&$qa_content)
	{
		$saved_msg = null;

		if (qa_clicked('markdown_save')) {
			// save options
			$hidecss = qa_post_text('md_hidecss') ? '1' : '0';
			qa_opt($this->cssopt, $hidecss);
			$convert = qa_post_text('md_comments') ? '1' : '0';
			qa_opt($this->convopt, $convert);
			$convert = qa_post_text('md_highlightjs') ? '1' : '0';
			qa_opt($this->hljsopt, $convert);
			$convert = qa_post_text('md_uploadimage') ? '1' : '0';
			qa_opt($this->impuplopt, $convert);

			$saved_msg = qa_lang_html('admin/options_saved');
		}


		return array(
			'ok' => $saved_msg,
					'style' => 'wide',

			'fields' => array(
				'css' => array(
					'type' => 'checkbox',
					'label' => qa_lang_html('markdown/admin_hidecss'),
					'tags' => 'NAME="md_hidecss"',
					'value' => qa_opt($this->cssopt) === '1',
					'note' => qa_lang_html('markdown/admin_hidecss_note'),
				),
				'comments' => array(
					'type' => 'checkbox',
					'label' => qa_lang_html('markdown/admin_comments'),
					'tags' => 'NAME="md_comments"',
					'value' => qa_opt($this->convopt) === '1',
					'note' => qa_lang_html('markdown/admin_comments_note'),
				),
				'highlightjs' => array(
					'type' => 'checkbox',
					'label' => qa_lang_html('markdown/admin_syntax'),
					'tags' => 'NAME="md_highlightjs"',
					'value' => qa_opt($this->hljsopt) === '1',
					'note' => qa_lang_html('markdown/admin_syntax_note'),
				),
				'uploadimage' => array(
					'type' => 'checkbox',
					'label' => qa_lang_html('markdown/admin_image'),
					'tags' => 'NAME="md_uploadimage"',
					'value' => qa_opt($this->impuplopt) === '1',
					'note' => qa_lang_html('markdown/admin_image_note'),
				)
			),

			'buttons' => array(
				'save' => array(
					'tags' => 'NAME="markdown_save"',
					'label' => qa_lang_html('admin/save_options_button'),
					'value' => '1',
				),
			),
		);
	}


	// copy of qa-base.php > qa_post_text, with trim() function removed.
	private function _my_qa_post_text($field)
	{
		return isset($_POST[$field]) ? preg_replace('/\r\n?/', "\n", qa_gpc_to_string($_POST[$field])) : null;
	}
}
