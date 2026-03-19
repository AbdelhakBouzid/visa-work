import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

function RichTextEditor({ value, onChange }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  );
}

export default RichTextEditor;
