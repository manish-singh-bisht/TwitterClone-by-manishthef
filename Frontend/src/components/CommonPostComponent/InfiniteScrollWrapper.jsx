import axios from "axios";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollWrapper = ({ children, dataLength, url, setArray }) => {
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);

  const fetchData = async () => {
    const { data } = await axios.get(`${url}${page}`, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (data.following) {
      setHasMore(Boolean(data.next));
      setArray((prev) => [...prev, ...data.following]);
    } else if (data.followers) {
      setHasMore(Boolean(data.next));
      setArray((prev) => [...prev, ...data.followers]);
    } else if (data.users) {
      setHasMore(Boolean(data.next));
      setArray((prev) => [...prev, ...data.users]);
    } else {
      setHasMore(Boolean(data.next));
      setArray((prev) => [...prev, ...data.posts]);
    }
    setPage((prev) => prev + 1);
  };

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={fetchData}
      className=" pb-44"
      hasMore={hasMore}
    >
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollWrapper;
