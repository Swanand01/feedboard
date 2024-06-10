import { Editor } from "@tiptap/react";
import {
  FontBoldIcon,
  CodeIcon,
  FontItalicIcon,
  ListBulletIcon,
  StrikethroughIcon,
  ResetIcon,
} from "@radix-ui/react-icons";
import { Toggle } from "../../toggle";
import { Toolbar } from "~/components/ui/toolbar";
import { FormatType } from "./format-type";

interface EditorToolbarProps {
  editor: Editor;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <Toolbar
      className="m-0 flex flex-wrap items-center justify-start p-2 rounded-md rounded-b-none"
      aria-label="Formatting options"
    >
      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        pressed={editor.isActive("bold")}
      >
        <FontBoldIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        pressed={editor.isActive("italic")}
        value="italic"
      >
        <FontItalicIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        pressed={editor.isActive("strike")}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        pressed={editor.isActive("bulletList")}
      >
        <ListBulletIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        pressed={editor.isActive("orderedList")}
      >
        1.
      </Toggle>

      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        pressed={editor.isActive("codeBlock")}
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <ResetIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        className="mr-1"
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <ResetIcon className="h-4 w-4 scale-x-[-1]" />
      </Toggle>

      <FormatType editor={editor} />
    </Toolbar>
  );
};

export default EditorToolbar;
