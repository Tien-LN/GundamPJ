import React, { useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import "katex/dist/katex.min.css";
import katex from "katex";
import renderMathInElement from "katex/dist/contrib/auto-render";

export default function App({ initialValue, onChange }) {

  return (
    <Editor
      apiKey='nl71men2ncih3uc3v4wqhwfrzggusikeipd69py8c3lb8cs1'
      init={{
        
        plugins: [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker',
          'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 
          'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 
          'exportword', 'exportpdf'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | latex ',

        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
        file_picker_callback: function(callback, value, meta) {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = async function() {
            const file = this.files[0];
            const formData = new FormData(); // Thêm dòng này để khai báo formData
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            try {
              const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              callback(data.secure_url, { alt: file.name });
            } catch (error) {
              console.error('Upload failed:', error);
            }
          };
          input.click();
        },
        setup: function (editor) {
          editor.ui.registry.addButton("latex", {
            text: "LaTeX",
            onAction: function () {
              const latex = prompt("Nhập công thức LaTeX:", "\\frac{a}{b}");
              if (latex) {
                editor.insertContent(`$$${latex}$$`);
                setTimeout(() => renderMathInElement(document.body), 500);
              }
            }
          });
        }
      }}
      initialValue={initialValue}
      onEditorChange={(content) =>{
        onChange(content);
        setTimeout(() => renderMathInElement(document.body), 500);
      }}
    />
  );
}