import React, { useEffect, useRef, useState } from "react";
import { Cross, PushPin, SearchIcon, Send } from "../SVGs/SVGs";
import ConversationProfile from "./ConversationProfile";
import Loader from "../Loader/Loader";
import axios from "axios";
import Avatar from "../Avatar/Avatar";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import { Link } from "react-router-dom";
import MessageOutline from "./MessageOutline";
import InfiniteScrollWrapperMessagesScrollableComponent from "../CommonPostComponent/InfiniteScrollWrapperMessagesScrollableComponent";
import { toast } from "react-toastify";

const MessageHomePage = () => {
    const searchInputRef = useRef(null);
    const targetRefMessage = useRef(null);
    const targetRefConversation = useRef(null);
    const [conversations, setConversations] = useState({ loading: false, activeConversation: null });
    const [conversationsArray, setConversationsArray] = useState([]);
    const [messages, setMessages] = useState({ prevId: null, messageLoading: false, showingMessages: false, selectedConversation: null });
    const [messageArray, setMessageArray] = useState([]);
    const [userSearched, setUserSearched] = useState({ loadingUser: false, userArray: [], active: false });
    const [isPinnedConversation, setIsPinnedConversation] = useState({ bool: false, id: null });
    const [reply, setReply] = useState({ bool: false, name: "", content: "" });

    const { state } = useGlobalContext();
    const scrollEnd = useRef(null);
    const handleNewMessageClick = () => {
        searchInputRef.current.focus();
        setUserSearched((prev) => ({ ...prev, active: true }));
    };
    const textareaRef = useRef(null);
    const [textareaValue, setTextareaValue] = useState("");
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(100, textareaRef.current.scrollHeight)}px`;
            textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > 100 ? "auto" : "hidden";
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const functionToGetAllConversations = async () => {
            setConversations((prev) => ({ ...prev, loading: true }));
            const { data } = await axios.get(`http://localhost:4000/api/v1/chat/conversation/getAll`, { withCredentials: true });
            setConversations((prev) => ({ ...prev, loading: false }));
            if (state.user.pinnedConversation) {
                const pinnedConversationIndex = data.conversations.findIndex((item) => item._id === state.user.pinnedConversation);

                if (pinnedConversationIndex !== -1) {
                    const pinnedConversation = data.conversations.splice(pinnedConversationIndex, 1)[0];
                    data.conversations.unshift(pinnedConversation);
                    setIsPinnedConversation({ bool: true, id: state.user.pinnedConversation });
                    setConversationsArray(data.conversations);
                }
            } else {
                setConversationsArray(data.conversations);
            }
        };

        functionToGetAllConversations();

        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const debounceFunction = (cb, delay = 700) => {
        let timeout;
        return (...args) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                cb(...args);
            }, delay);
        };
    };
    const searchHandler = debounceFunction(async (e) => {
        const valueTyped = e.target.value;
        if (!valueTyped.trim()) {
            setUserSearched((prev) => ({ ...prev, userArray: [], loadingUser: false }));
            return;
        }

        const { data } = await axios.get(`http://localhost:4000/api/v1/search/${valueTyped}`, { withCredentials: true });
        if (data.users) {
            setUserSearched((prev) => ({ ...prev, userArray: data.users, message: null, loadingUser: false }));
        } else {
            setUserSearched((prev) => ({ ...prev, message: data.message, loadingUser: false }));
        }
    }, 700);

    const getAllMessagesForConversation = async (id) => {
        setTextareaValue("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
        setMessages((prev) => ({ ...prev, messageLoading: true }));
        const { data } = await axios.get(`http://localhost:4000/api/v1/chat/message/getAll/${id}`, { withCredentials: true });
        const selectedConversation = conversationsArray.filter((item) => {
            return item._id === id;
        });
        setMessages((prev) => ({ ...prev, messageLoading: false, showingMessages: true, prevId: id, selectedConversation: selectedConversation }));

        setMessageArray(data.messages);
    };

    const sendMessage = async (content, conversation) => {
        const { data } = await axios.post(
            `http://localhost:4000/api/v1/chat/message/create`,
            { conversationId: conversation, senderId: state.user._id, content: content, replyTo: reply.bool && { name: reply.name, message: reply.content } },

            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        setMessageArray((prev) => [...prev, data.newMessage]);
        scrollEnd.current && scrollEnd.current.scrollIntoView();
        setReply({ bool: false, name: "", content: "" });
        setTextareaValue("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };
    const createConversationHandler = async (id) => {
        const toastConfig = {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            closeButton: false,
            style: {
                backgroundColor: "#1DA1F2",
                border: "none",
                boxShadow: "none",
                width: "fit-content",
                zIndex: 9999,
                color: "white",
                padding: "0px 16px",
                minHeight: "3rem",
            },
        };
        try {
            const { data } = await axios.post(
                `http://localhost:4000/api/v1/chat/conversation/create`,
                { senderId: state.user._id, receiverId: id },

                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            setConversationsArray((prev) => [...prev, data.conversation]);
        } catch (error) {
            toast(error.response.data.message, toastConfig);
        }
    };

    const urlConversation = `http://localhost:4000/api/v1/chat/conversation/getAll?page=`;
    const urlMessages = `http://localhost:4000/api/v1/chat/message/getAll/${conversations.activeConversation}?page=`;

    return (
        <div className="fixed z-10 grid h-[100vh] w-[calc(100vw-24rem)] grid-cols-[24.5rem_auto] bg-white">
            <div className="h-full overflow-y-auto border-l border-r " ref={targetRefConversation}>
                <div className="sticky inset-0 z-10 flex   flex-col  bg-white/60  backdrop-blur-md  ">
                    <h1 className="mx-2  py-2 text-2xl font-bold">Messages</h1>
                </div>

                <div className="mx-4 mt-5  mb-4 min-h-[2.75rem]     rounded-full border-2 bg-white  focus-within:border-blue-500">
                    <div className="mx-4 flex min-h-[2.75rem] w-full items-center justify-center gap-2 pl-4 ">
                        <div>
                            <SearchIcon className="  " />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search People"
                                ref={searchInputRef}
                                className="h-full w-full bg-transparent  text-black outline-none placeholder:text-[1rem] placeholder:text-gray-600 "
                                onFocus={() => setUserSearched((prev) => ({ ...prev, active: true }))}
                                onBlur={(e) => {
                                    setTimeout(() => {
                                        setUserSearched((prev) => ({ ...prev, active: false, userArray: [] }));
                                        e.target.value = "";
                                    }, 100);
                                }}
                                onChange={(e) => {
                                    setUserSearched((prev) => ({ ...prev, loadingUser: true }));
                                    searchHandler(e);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    {userSearched.loadingUser ? (
                        <Loader />
                    ) : userSearched.active && !userSearched.loadingUser ? (
                        <div className="mx-auto   max-h-[20rem]   min-h-[6rem] w-[350px] justify-center overflow-y-auto rounded-xl border-2 bg-white text-center drop-shadow-lg">
                            {userSearched.userArray.length === 0 ? (
                                <div className="  mt-4 min-h-[6rem] text-gray-600">Try searching for people</div>
                            ) : (
                                <>
                                    {userSearched.message ? (
                                        <div className="mt-4  h-24 text-gray-600 underline">{userSearched.message}</div>
                                    ) : (
                                        <div className="flex flex-col ">
                                            {userSearched.userArray.map((item) => {
                                                return (
                                                    <div
                                                        onClick={() => {
                                                            createConversationHandler(item._id);
                                                        }}
                                                        className="flex items-start gap-1 p-3 hover:bg-gray-50"
                                                        key={item._id}>
                                                        <Avatar profile={item.profile && item.profile.image && item.profile.image.url ? item.profile.image.url : null} />
                                                        <div className="flex flex-col items-start">
                                                            <span className="font-bold hover:underline">{item.name.length > 30 ? item.name.slice(0, 30).trim() + "..." : item.name}</span>
                                                            <span className="mt-[-0.2rem] text-gray-600">@{item.handle.length > 26 ? item.handle.slice(0, 26).trim() + "..." : item.handle}</span>

                                                            {state.user.following.includes(item._id) && (
                                                                <span className="flex items-center text-gray-600">
                                                                    <svg className="  h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                                    </svg>
                                                                    Following
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : null}
                </div>
                {isPinnedConversation?.bool && (
                    <div className="mx-5 mt-1 flex items-center gap-1   text-[1.2rem] font-bold ">
                        <div className=" text-black">
                            <PushPin />
                        </div>
                        <div>Pinned Conversation</div>
                    </div>
                )}
                {targetRefConversation.current && (
                    <InfiniteScrollWrapperMessagesScrollableComponent dataLength={conversationsArray.length} url={urlConversation} setArray={setConversationsArray} scrollableTarget={targetRefConversation.current}>
                        {conversations.loading ? (
                            <Loader />
                        ) : conversationsArray && conversationsArray.length > 0 ? (
                            conversationsArray.map((conversation) => {
                                return (
                                    <div
                                        className={`${conversations.activeConversation === conversation._id ? "border-r-[0.2rem] border-r-blue-500 bg-[#EFF3F4]" : null}`}
                                        key={conversation._id}
                                        onClick={(e) => {
                                            conversation._id !== messages.prevId && getAllMessagesForConversation(conversation._id);
                                            setConversations((prev) => ({ ...prev, activeConversation: conversation._id }));
                                        }}>
                                        <ConversationProfile
                                            key={conversation._id}
                                            conversationid={conversation._id}
                                            profile={conversation.participants[0].profile && conversation.participants[0].profile.image && conversation.participants[0].profile.image.url ? conversation.participants[0].profile.image.url : null}
                                            name={conversation.participants[0].name}
                                            setConversationsArray={setConversationsArray}
                                            setMessages={setMessages}
                                            handle={conversation.participants[0].handle}
                                            latest={
                                                conversation.latest && conversation.latest[0] && conversation.latest[0].userId === state.user._id && conversation.latest[0].message && conversation.latest[0].message.content
                                                    ? conversation.latest[0].message.content
                                                    : ""
                                            }
                                            date={conversation.latest && conversation.latest[0] && conversation.latest[0].message && conversation.latest[0].message.createdAt ? conversation.latest[0].message.createdAt : ""}
                                            setIsPinnedConversation={setIsPinnedConversation}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="mt-8 flex flex-col items-center justify-center">
                                <div className="w-[22rem] text-[2rem]  font-extrabold leading-[2.3rem]">Send a message,get a message</div>
                                <div className="mt-5 w-[22rem]  text-gray-500 ">Direct Messages are private conversations between you and other people on Twitter.</div>
                                <button className="mt-5 flex h-12 w-[fit] items-center justify-center rounded-3xl bg-blue-500 px-4 text-[1.2rem] font-bold text-white hover:bg-blue-600 active:bg-blue-800 " onClick={handleNewMessageClick}>
                                    Start a conversation
                                </button>
                            </div>
                        )}
                    </InfiniteScrollWrapperMessagesScrollableComponent>
                )}
            </div>
            <div className=" h-full w-[86%] overflow-y-auto   border-r" id="scrollableDiv" ref={targetRefMessage}>
                {!messages.showingMessages && (
                    <div className="flex h-full items-center justify-center ">
                        <div className=" flex flex-col items-center justify-center  ">
                            <div className="w-[22rem]  text-center text-[2rem] font-extrabold">Select a message</div>
                            <div className="w-[22rem] text-center text-gray-500 ">Choose from your existing conversations, start a new one, or just keep swimming.</div>
                            <button className="mt-5 flex h-12 w-[11rem] items-center justify-center rounded-3xl bg-blue-500 text-[1.2rem] font-bold text-white hover:bg-blue-600 active:bg-blue-800 " onClick={handleNewMessageClick}>
                                New message
                            </button>
                        </div>
                    </div>
                )}

                {messages.showingMessages && (
                    <>
                        <div className={`mb-[0.15rem]   ${messageArray.length > 0 ? "overflow-y-auto " : "h-full overflow-hidden"}`}>
                            <div className="sticky  inset-0 z-10 flex h-fit  flex-col  bg-white/60  backdrop-blur-md  ">
                                <h1 className="mx-2   h-10 py-2 text-2xl font-bold"></h1>
                            </div>
                            <Link to={`/Profile/${messages.selectedConversation[0].participants[0].handle}`}>
                                <div className="flex flex-col items-center justify-center  border-b py-4 pb-[6rem] hover:bg-gray-100">
                                    <div>
                                        {messages.selectedConversation[0].participants[0].profile && messages.selectedConversation[0].participants[0].profile.image && messages.selectedConversation[0].participants[0].profile.image.url ? (
                                            <div className="mx-[1.05rem] mt-[1.05rem] h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full   bg-gray-400">
                                                <img src={messages.selectedConversation[0].participants[0].profile.image.url} alt="profile image" loading="lazy" className="h-full w-full rounded-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="relative m-1   flex h-[4.5rem] w-[4.5rem] items-center justify-center  rounded-full bg-gray-200">
                                                <svg className="  h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-1 text-[1.1rem] font-bold">{messages.selectedConversation[0].participants[0].name}</div>
                                    <div className="text-gray-700">@{messages.selectedConversation[0].participants[0].handle}</div>

                                    <div className="flex w-fit items-center gap-1 text-gray-700 ">
                                        <span className="mt-2 ">{`Joined ${new Date(Date.parse(messages.selectedConversation[0].participants[0].createdAt)).toLocaleString("default", {
                                            month: "short",
                                        })} ${new Date(Date.parse(messages.selectedConversation[0].participants[0].createdAt)).getFullYear()}`}</span>

                                        <span className=" flex items-center justify-center  text-[0.8rem]">{"."}</span>
                                        <span className="mt-2 ">{`${messages.selectedConversation[0].participants[0].followersCount} Followers`}</span>
                                    </div>
                                </div>
                            </Link>

                            {messages.messageLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    <InfiniteScrollWrapperMessagesScrollableComponent dataLength={messageArray.length} url={urlMessages} setArray={setMessageArray} scrollableTarget={targetRefMessage.current}>
                                        {messageArray.length > 0
                                            ? messageArray.map((message) => {
                                                  return (
                                                      <MessageOutline
                                                          key={message._id}
                                                          setMessageArray={setMessageArray}
                                                          messageFull={message}
                                                          message={message.content}
                                                          date={message.createdAt}
                                                          sender={message.sender._id}
                                                          replyTo={message.replyTo}
                                                          setReply={setReply}
                                                      />
                                                  );
                                              })
                                            : null}
                                    </InfiniteScrollWrapperMessagesScrollableComponent>
                                </>
                            )}
                        </div>
                        <div ref={scrollEnd} className="pt-[3.8rem]"></div>

                        <div className="sticky bottom-0 flex w-full flex-col items-center  border-t bg-white pt-[0.15rem] ">
                            {reply.bool && (
                                <div className={` my-[0.5rem]  flex w-full flex-col border-l-[0.4rem] border-l-black  bg-[#F7F9F9]	pl-2 align-middle `}>
                                    <div className="flex w-full justify-between ">
                                        <div className="font-bold ">{reply.name}</div>
                                        <div
                                            onClick={() => {
                                                setReply({ bool: false, content: "", name: "" });
                                            }}
                                            className="mt-1 h-fit cursor-pointer rounded-full hover:bg-blue-100 hover:text-blue-500">
                                            <Cross />
                                        </div>
                                    </div>
                                    <div className="overflow-x-hidden break-words text-gray-800">{reply.content}</div>
                                </div>
                            )}
                            <div className="flex w-full items-center justify-around ">
                                <textarea
                                    className="w-[90%] resize-none rounded-xl bg-[#EFF3F4] px-2  outline-none "
                                    ref={textareaRef}
                                    onInput={(e) => {
                                        adjustTextareaHeight();
                                        setTextareaValue(e.target.value);
                                    }}
                                    value={textareaValue}></textarea>
                                <button
                                    className={`${textareaValue.length < 1 ? "null" : "active:text-blue-800"} text-blue-500 `}
                                    disabled={textareaValue.length < 1}
                                    onClick={() => {
                                        sendMessage(textareaValue, conversations.activeConversation);
                                    }}>
                                    <Send />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageHomePage;