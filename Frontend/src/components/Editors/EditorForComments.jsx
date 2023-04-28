import { useEffect, useState } from "react";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mention } from "@tiptap/extension-mention";
import suggestion from "./Mentions/suggestion";
import Placeholder from "@tiptap/extension-placeholder";

import "./EditorStyles.css";

const EditorForComments = ({ onChange: change, isReplyPress, handleIsReplyPressFalse }) => {
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
                class: `mt-2 resize-none overflow-hidden text-2xl  outline-none border-2  w-[35rem]`,
            },
        },
        content: ``,
        onUpdate({ editor }) {
            setEditorContent(editor.getHTML());
            change(editor.getText());
        },
    });
    useEffect(() => {
        if (isReplyPress && editor) {
            editor.commands.clearContent(true);
            handleIsReplyPressFalse();
        }
    }, [isReplyPress]);

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
    function getAllNodesAttributesByType(doc, nodeType) {
        const result = [];

        doc.descendants((node) => {
            if (node.type.name === nodeType) {
                result.push(node.attrs);
            }
        });

        return result;
    }
    // console.log(getAllNodesAttributesByType(editor.state.doc, "mention"));

    return <EditorContent editor={editor} />;
};

export default EditorForComments;
