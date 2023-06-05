import { useEffect, useState } from "react";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mention } from "@tiptap/extension-mention";
import suggestion from "./Mentions/suggestion";
import Placeholder from "@tiptap/extension-placeholder";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import PostComments from "../../context/Actions/PostComments";

import "./EditorStyles.css";

const EditorForComments = ({ onChange: change, isReplyPress, handleIsReplyPressFalse, postId, parent }) => {
    const [editorContent, setEditorContent] = useState("");
    const { dispatchComment, ACTIONS } = useGlobalContext();

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
                class: `mt-2 resize-none overflow-hidden text-2xl  outline-none   w-[35rem]`,
            },
        },
        content: ``,
        onUpdate({ editor }) {
            setEditorContent(editor.getHTML());
            change(editor.getText());
        },
    });
    useEffect(() => {
        const whenIsReplyIsPressed = async () => {
            if (isReplyPress && editor) {
                const mentions = getAllNodesAttributesByType(editor.state.doc, "mention");
                const text = editor.getText();

                editor.commands.clearContent(true);
                handleIsReplyPressFalse();
                await PostComments({ dispatchComment, ACTIONS, postId, comment: text, parent, mentions: mentions });
            }
        };
        whenIsReplyIsPressed();
    }, [isReplyPress]);

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

    return <EditorContent editor={editor} />;
};

export default EditorForComments;
