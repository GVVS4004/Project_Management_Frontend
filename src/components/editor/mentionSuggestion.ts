  import { ReactRenderer } from "@tiptap/react";
  import tippy, { type Instance } from "tippy.js";
  import MentionList from "./MentionList";
  import { userApi } from "../../services/auth.service";

  const mentionSuggestion = {
    char: "@",
    items: async ({ query }: { query: string }) => {
      if (!query) return [];
      try {
        return await userApi.searchUsers(query, 10);
      } catch {
        return [];
      }
    },
    render: () => {
      let component: ReactRenderer | null = null;
      let popup: Instance[] | null = null;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) return;

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

        onUpdate: (props: any) => {
          component?.updateProps(props);
          if (props.clientRect && popup?.[0]) {
            popup[0].setProps({
              getReferenceClientRect: props.clientRect,
            });
          }
        },

        onKeyDown: (props: any) => {
          if (props.event.key === "Escape") {
            popup?.[0]?.hide();
            return true;
          }
          return (component?.ref as any)?.onKeyDown(props);
        },

        onExit: () => {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },
  };

  export default mentionSuggestion;