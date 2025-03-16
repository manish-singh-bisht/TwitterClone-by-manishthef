import axios from "axios";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollWrapperMessagesScrollableComponent = ({
  children,
  dataLength,
  url,
  setArray,
  scrollableTarget,
  fromCoversation,
}) => {
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);

  const fetchData = async () => {
    const { data } = await axios.get(`${url}${page}`, {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (data.conversations) {
      setHasMore(Boolean(data.next));
      setArray((prev) => [...prev, ...data.conversations]);
    } else if (data.messages) {
      setHasMore(Boolean(data.next));
      setArray((prev) => [...prev, ...data.messages]);
    }
    setPage((prev) => prev + 1);
  };

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={fetchData}
      inverse={fromCoversation ? false : true}
      className={`${fromCoversation ? "pb-7" : "flex flex-col-reverse pb-7"}`}
      hasMore={hasMore}
      scrollableTarget={scrollableTarget}
    >
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollWrapperMessagesScrollableComponent;
