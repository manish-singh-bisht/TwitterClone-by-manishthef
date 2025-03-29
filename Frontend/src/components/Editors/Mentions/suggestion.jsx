import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import axios from "axios";
import MentionList from "./MentionList.jsx";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { API_BASE_URL } from "../../../../config.js";

export default {
  items: AwesomeDebouncePromise(async ({ query }) => {
    if (query.length < 1) {
      return [];
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/search/${query}`, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (data.users && data.users.length > 0) {
        const users = data.users;

        return users.map((user) => {
          const name = user.name;
          const image =
            user.profile && user.profile.image && user.profile.image.url
              ? user.profile.image.url
              : null;
          const handle = user.handle;

          return { name: name, url: image, handle: handle };
        });
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }, 250),

  render: () => {
    let component;
    let popup;
    const destroyedPopups = new WeakSet();

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        if (!destroyedPopups.has(popup)) {
          popup[0].destroy();
          component.destroy();
          destroyedPopups.add(popup);
        }
      },
    };
  },
};
