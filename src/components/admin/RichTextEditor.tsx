import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Json } from "@/integrations/supabase/types";

export function RichTextEditor({ content, onChange }: { content: Json; onChange: (content: Json) => void }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false } })],
    content: typeof content === "object" && content ? JSON.parse(JSON.stringify(content)) : undefined,
    immediatelyRender: false,
    editorProps: { attributes: { class: "min-h-60 p-4 outline-none font-mono text-sm [&_h2]:text-2xl [&_h2]:font-display [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-4" } },
    onUpdate: ({ editor: current }) => onChange(JSON.parse(JSON.stringify(current.getJSON()))),
  });
  const tools = [
    { label: "Gras", icon: Bold, action: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italique", icon: Italic, action: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Titre", icon: Heading2, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Liste", icon: List, action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Liste numérotée", icon: ListOrdered, action: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Citation", icon: Quote, action: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: "Annuler", icon: Undo2, action: () => editor?.chain().focus().undo().run() },
    { label: "Rétablir", icon: Redo2, action: () => editor?.chain().focus().redo().run() },
  ];
  return <div className="border-2 border-ink bg-paper">
    <div className="flex flex-wrap gap-1 border-b-2 border-ink p-2">
      {tools.map((tool) => <Button key={tool.label} type="button" variant="ghost" size="icon" title={tool.label} aria-label={tool.label} onClick={tool.action}><tool.icon /></Button>)}
    </div>
    <EditorContent editor={editor} />
  </div>;
}