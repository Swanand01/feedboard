import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { HardBreak } from "@tiptap/extension-hard-break";
import EditorToolbar from "./toolbar/editor-toolbar";

interface EditorProps {
  content: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const Editor = ({ content, placeholder, onChange }: EditorProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "w-full h-[180px] lg:h-[200px] px-2 py-0 focus-visible:outline-none  overflow-auto border border-input bg-transparent dark:prose-invert rounded-b-md",
      },
    },
    extensions: [
      StarterKit.configure({ hardBreak: false }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
          };
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return <></>;

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};

export default Editor;
