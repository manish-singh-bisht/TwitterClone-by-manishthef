import { useState, useEffect } from "react";

export function usePostTime(postTime) {
    const [formattedTime, setFormattedTime] = useState("");

    useEffect(() => {
        function formatPostTime(postTime) {
            const now = Date.now();
            const diffMs = now - postTime;

            // Check if the post is more than 3 days old
            if (diffMs >= 259200000) {
                const date = new Date(postTime);
                const month = date.toLocaleString("default", { month: "short" });
                const day = date.getDate();
                setFormattedTime(`${month} ${day}`);
            } else {
                // Calculate the elapsed time
                const elapsedMs = Math.abs(diffMs);
                const elapsedSeconds = Math.floor(elapsedMs / 1000);
                const elapsedMinutes = Math.floor(elapsedSeconds / 60);
                const elapsedHours = Math.floor(elapsedMinutes / 60);

                // Format the time
                if (elapsedHours >= 24) {
                    const days = Math.floor(elapsedHours / 24);
                    setFormattedTime(`${days}d`);
                } else if (elapsedMinutes >= 60) {
                    const hours = Math.floor(elapsedMinutes / 60);
                    setFormattedTime(`${hours}h`);
                } else if (elapsedSeconds >= 60) {
                    setFormattedTime(`${elapsedMinutes}m`);
                } else {
                    setFormattedTime(`${elapsedSeconds}s`);
                }
            }
        }

        const intervalId = setInterval(() => {
            formatPostTime(postTime);
        }, 60000);

        formatPostTime(postTime);

        return () => clearInterval(intervalId);
    }, [postTime]);

    return formattedTime;
}

export function usePostTimeInTweetDetail(postTime) {
    const [formattedTime, setFormattedTime] = useState("");

    useEffect(() => {
        function formatPostTime(postTime) {
            const date = new Date(postTime);
            const options = { hour: "numeric", minute: "numeric", hour12: true };
            const time = date.toLocaleString("en-US", options);
            const month = date.toLocaleString("en-US", { month: "short" });
            const day = date.toLocaleString("en-US", { day: "numeric" });
            const year = date.toLocaleString("en-US", { year: "numeric" });

            setFormattedTime(`${time} · ${month} ${day}, ${year}`);
        }

        formatPostTime(postTime);
    }, [postTime]);

    return formattedTime;
}
