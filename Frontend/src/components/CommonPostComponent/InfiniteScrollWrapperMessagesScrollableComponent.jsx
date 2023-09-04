import axios from "axios";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollWrapperMessagesScrollableComponent = ({ children, dataLength, url, setArray, scrollableTarget }) => {
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);

    const fetchData = async () => {
        const { data } = await axios.get(`${url}${page}`, { withCredentials: true });
        if (data.conversations) {
            setHasMore(Boolean(data.conversations.length));
            setArray((prev) => [...prev, ...data.conversations]);
        } else if (data.messages) {
            setHasMore(Boolean(data.messages.length));
            setArray((prev) => [...prev, ...data.messages]);
        }
        setPage((prev) => prev + 1);
    };

    return (
        <InfiniteScroll dataLength={dataLength} next={fetchData} className=" pb-7" hasMore={hasMore} scrollableTarget={scrollableTarget}>
            {children}
        </InfiniteScroll>
    );
};

export default InfiniteScrollWrapperMessagesScrollableComponent;
