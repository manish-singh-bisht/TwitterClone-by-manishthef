import { useCallback, useEffect, useState } from "react";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mention } from "@tiptap/extension-mention";
import suggestion from "./Mentions/suggestion";
import Placeholder from "@tiptap/extension-placeholder";
import "./EditorStyles.css";
import PostTweet from "../../context/Actions/PostTweet";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import PhotoGallery from "../CommonPostComponent/PhotoGallery";

const EditorInHome = ({ onChange: change, showGlobeHandler, isTweetPress, handleIsTweetPressFalse, isTweetPressInTweetModal, handleIsTweetPressInTweetModalFalse, selectedImages, deleteImages, setSelectedImages }) => {
    const [editorContent, setEditorContent] = useState("");
    const { ACTIONS, dispatchPostTweet, setPosts } = useGlobalContext();
    const [isSent, setIsSent] = useState(false);
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
                class: `mt-2 resize-none overflow-hidden text-2xl  outline-none  w-[35rem]`,
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
        const whenIsTweetIsPressed = async () => {
            if ((isTweetPress || isTweetPressInTweetModal) && editor) {
                const mentions = getAllNodesAttributesByType(editor.state.doc, "mention");
                const text = editor.getText();

                setIsSent(true);
                handleIsTweetPressFalse();
                handleIsTweetPressInTweetModalFalse();
                if (isTweetPress && !isTweetPressInTweetModal) {
                    const data = await PostTweet({ dispatchPostTweet, ACTIONS, tweet: text, parent: null, mentions: mentions, threadIdForTweetInThread: null, images: selectedImages });
                    //the threadIdForTweetInThread here is null because this threadIdForTweetInThread is uuid and not the _id of mongodb,this threadIdForTweetInThread is just created for thread purpose and not for single tweets.
                    if (selectedImages.length > 0 && data !== undefined) {
                        data.images = selectedImages;
                    }
                    setPosts((prev) => [data, ...prev]);
                }
                setIsSent(false);
                editor.commands.clearContent(true);
                setSelectedImages([]);
            }
        };
        whenIsTweetIsPressed();
    }, [isTweetPress, isTweetPressInTweetModal]);

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
    //Grid layout for different numbers of image,used below
    let gridClass = "";
    switch (selectedImages.length) {
        case 0:
            gridClass = "";
            break;
        case 1:
            gridClass = "w-full h-full";
            break;
        case 2:
            gridClass = "grid-cols-2 grid-rows-1";
            break;
        case 3:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        case 4:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        default:
            break;
    }
    return (
        <div className="h-fit">
            {isSent && <div className="tweet-sent-animation"></div>}
            <EditorContent editor={editor} />
            <div className={`m-[-0.25rem] mt-8 grid max-w-[98%]  ${gridClass}  ${selectedImages.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${selectedImages.length > 0 ? `border-[0.05rem]` : ``}`}>
                {selectedImages.length > 0 && selectedImages.map((photo, index) => <PhotoGallery key={index} photos={selectedImages} photo={photo} index={index} deleteImages={deleteImages} mark={true} />)}
            </div>
        </div>
    );
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

export default EditorInHome;
