import { useEffect, useState } from "react";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mention } from "@tiptap/extension-mention";
import suggestion from "./Mentions/suggestion";
import Placeholder from "@tiptap/extension-placeholder";

import "./EditorStyles.css";

const EditorInHome = ({ onChange: change, showGlobeHandler }) => {
    const [editorContent, setEditorContent] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit,

            Placeholder.configure({
                placeholder: "What's happening?",
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
                class: `mt-2 resize-none overflow-hidden text-2xl  outline-none border-2 w-[35rem]`,
            },
        },
        content: ``,
        onUpdate({ editor }) {
            setEditorContent(editor.getHTML());
            change(editor.getText());
        },
        onFocus() {
            showGlobeHandler();
        },
    });

    useEffect(() => {
        const handleKey = (event) => {
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

    return <EditorContent editor={editor} />;
};

export default EditorInHome;
