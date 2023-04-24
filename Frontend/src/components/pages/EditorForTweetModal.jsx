import { forwardRef, useEffect, useState } from "react";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mention } from "@tiptap/extension-mention";
import suggestion from "./suggestion";
import Placeholder from "@tiptap/extension-placeholder";
import "./EditorStyles.css";

const EditorForTweetModal = forwardRef(({ height, width, placeholder, c, value }) => {
    const [editorContent, setEditorContent] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
            Color.configure({
                types: ["textStyle"],
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: "mention ",
                },
                suggestion,
            }),
            TextStyle.configure({
                types: ["textStyle"],
            }),
        ],
        editorProps: {
            attributes: {
                class: `resize-none overflow-hidden border-2 text-2xl outline-none ${height} ${width}`,
            },
        },
        content: ``,
        onUpdate({ editor }) {
            setEditorContent(editor.getHTML());
        },
    });

    useEffect(() => {
        const handleKey = (event) => {
            const { selection } = editor.state;
            if (event.key === "@") {
                editor.commands.setColor("blue");
            } else if (event.key === " ") {
                editor.commands.unsetColor("blue");
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }
    const newValue = editor?.getText();

    return <EditorContent editor={editor} onChange={value(newValue)} onClick={c(newValue)} />;
});

export default EditorForTweetModal;
