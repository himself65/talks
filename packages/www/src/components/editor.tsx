"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    immediatelyRender: false,
    content:
      "\n" +
      "<h2>\n" +
      "  Hi there,\n" +
      "</h2>\n" +
      "<p>\n" +
      "  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:\n" +
      "</p>\n" +
      "<ul>\n" +
      "  <li>\n" +
      "    That’s a bullet list with one …\n" +
      "  </li>\n" +
      "  <li>\n" +
      "    … or two list items.\n" +
      "  </li>\n" +
      "</ul>\n" +
      "<p>\n" +
      "  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:\n" +
      "</p>\n" +
      '<pre><code class="language-css">body {\n' +
      "  display: none;\n" +
      "}</code></pre>\n" +
      "<p>\n" +
      "  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.\n" +
      "</p>\n" +
      "<blockquote>\n" +
      "  Wow, that’s amazing. Good work, boy! 👏\n" +
      "  <br />\n" +
      "  — Mom\n" +
      "</blockquote>\n",
  });

  return <EditorContent editor={editor} />;
}
