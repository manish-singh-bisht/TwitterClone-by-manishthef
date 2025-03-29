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
import PhotoGallery from "../CommonPostComponent/PhotoGallery";

const EditorForComments = ({ onChange: change, isReplyPress, handleIsReplyPressFalse, postId, parent, setShowReplyingToHandler, selectedImages, deleteImages, setSelectedImages, fromActiveComment }) => {
    const [editorContent, setEditorContent] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isFirstTimeFocus, setIsFirstTimeFocus] = useState(true);
    const { dispatchComment, ACTIONS, setCommentArray, setComment, comment } = useGlobalContext();

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
                class: `mt-2 resize-none overflow-hidden text-2xl  outline-none w-[94vw]  md:w-[35rem] pl-[1.5rem]`,
            },
        },
        content: ``,
        onUpdate({ editor }) {
            setEditorContent(editor.getHTML());
            change(editor.getText());
        },
        onFocus() {
            if (isFirstTimeFocus) {
                setShowReplyingToHandler();
                setIsFirstTimeFocus(false); // Set isFirstTimeFocus to false to prevent running this block again
            }
        },
    });
    useEffect(() => {
        const whenIsReplyIsPressed = async () => {
            if (isReplyPress && editor) {
                setIsSent(true);
                const mentions = getAllNodesAttributesByType(editor.state.doc, "mention");
                const text = editor.getText();

                handleIsReplyPressFalse();
                setIsFirstTimeFocus(true);
                const data = await PostComments({ dispatchComment, ACTIONS, postId, comment: text, parent, mentions: mentions, images: selectedImages });

                if (selectedImages.length > 0 && data !== undefined) {
                    data.comment.images = selectedImages;
                }
                if (fromActiveComment) {
                    if (data !== undefined) {
                        setComment((prev) => {
                            const updatedActiveComment = { ...prev.activeComment };
                            const updatedChildren = [...updatedActiveComment.comment.children];
                            updatedChildren.unshift(data.comment);

                            updatedActiveComment.comment.children = [...new Set(updatedChildren)];

                            const tempArray = [...prev.comments];
                            const findIndexOFactiveCommentParentInArray = tempArray?.findIndex((item) => {
                                return item.comment._id === updatedActiveComment?.comment?.parent?._id;
                            });
                            if (findIndexOFactiveCommentParentInArray !== -1) {
                                const updatedComment = { ...tempArray[findIndexOFactiveCommentParentInArray] };
                                const indexOfActiveCommentInChildrenArrayOfParentComment = updatedComment?.comment?.children?.findIndex((item) => {
                                    return item._id === updatedActiveComment.comment._id;
                                });

                                const updatedChildren = [...updatedComment.comment.children[indexOfActiveCommentInChildrenArrayOfParentComment].children];
                                updatedChildren.unshift(data.comment);
                                updatedComment.comment.children[indexOfActiveCommentInChildrenArrayOfParentComment].children = [...new Set(updatedChildren)];
                                tempArray[findIndexOFactiveCommentParentInArray] = updatedComment;
                            }

                            return {
                                ...prev,
                                comment: tempArray,
                                activeComment: updatedActiveComment,
                            };
                        });
                    } else {
                        setComment((prev) => ({ ...prev }));
                    }
                } else {
                    if (data !== undefined) {
                        setCommentArray((prev) => [data.comment, ...prev]);
                    } else {
                        setCommentArray((prev) => [...prev]);
                    }
                }

                editor.commands.clearContent(true);
                setSelectedImages([]);
                setIsSent(false);
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

export default EditorForComments;
