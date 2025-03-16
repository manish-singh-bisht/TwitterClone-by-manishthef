import { useEffect, useState } from "react";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mention } from "@tiptap/extension-mention";
import suggestion from "./Mentions/suggestion";
import Placeholder from "@tiptap/extension-placeholder";
import "./EditorStyles.css";

const EditorForTweetModal = ({ height, width, placeholder, onClick: click, onChange: change, whenEditorInFocus, initialTweetFromOtherPartsOfApp, isTweetPress, onClose, tweets }) => {
    const [editorContent, setEditorContent] = useState("");
    const editor = useEditor({
        autofocus: true,
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
                class: `resize-none overflow-hidden text-2xl outline-none ${height} ${width}`,
            },
        },
        content: ``,

        onUpdate({ editor }) {
            setEditorContent(editor.getHTML());
            change(editor.getText(), getAllNodesAttributesByType(editor.state.doc, "mention"));
        },
        onFocus({ event }) {
            whenEditorInFocus();
        },
    });
    useEffect(() => {
        if (initialTweetFromOtherPartsOfApp !== null && editor) {
            editor.commands.setContent(initialTweetFromOtherPartsOfApp.text, { emitUpdate: true });
        }
    }, [editor]);

    useEffect(() => {
        if (editor !== null && placeholder !== "") {
            editor.extensionManager.extensions.filter((extension) => extension.name === "placeholder")[0].options["placeholder"] = placeholder;
            editor.view.dispatch(editor.state.tr);
        }
    }, [editor, placeholder]);

    useEffect(() => {
        const handleKey = (event) => {
            const cursorPosition = editor.state.selection.$head.pos;

            if (event.key === "@") {
                // Check if the character at the current cursor position is "@" and not followed by a non-space character
                const isAtFirstPosition = cursorPosition === 1;
                const isPrecededBySpace = cursorPosition > 1 && editor.state.doc.textBetween(cursorPosition - 1, cursorPosition) === " ";

                if (isAtFirstPosition || isPrecededBySpace) {
                    editor.commands.setColor("blue");
                } else {
                    editor.commands.unsetColor("blue");
                }
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

    return <EditorContent editor={editor} onClick={() => click(editor.getText())} />;
};
//for getting all the mentions that are real users in backend
function getAllNodesAttributesByType(doc, nodeType) {
    const result = [];

    doc.descendants((node) => {
        if (node.type.name === nodeType) {
            result.push(node.attrs.id);
        }
    });

    return result;
}
export default EditorForTweetModal;
