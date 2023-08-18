import axios from "axios";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollWrapper = ({ children, dataLength, url, setArray }) => {
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);

    const fetchData = async () => {
        const { data } = await axios.get(`${url}${page}`, { withCredentials: true });
        if (data.following) {
            setHasMore(Boolean(data.following.length));
            setArray((prev) => [...prev, ...data.following]);
        } else if (data.followers) {
            setHasMore(Boolean(data.followers.length));
            setArray((prev) => [...prev, ...data.followers]);
        } else {
            setHasMore(Boolean(data.posts.length));
            setArray((prev) => [...prev, ...data.posts]);
        }
        setPage((prev) => prev + 1);
    };

    return (
        <InfiniteScroll dataLength={dataLength} next={fetchData} className=" pb-44" hasMore={hasMore}>
            {children}
        </InfiniteScroll>
    );
};

export default InfiniteScrollWrapper;
