import { findAndReplace } from "mdast-util-find-and-replace";

// Matches URI that starts with bos:// scheme. Examples:
// 1. bos://mob.near/widget/Profile
// 2. bos://mob.near/widget/Profile?accountId=root.near
// 3. bos://near.org/mob.near/widget/Profile?accountId=root.near
// 4. bos://near.social/#/mob.near/widget/Profile?accountId=root.near
const widgetUrlRegex = /^bos:\/\/(?:[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b)?(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*?)((?:(?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)\/widget\/(?:[-a-zA-Z0-9()@:%_\+.~#&\/=]+))(\?[-a-zA-Z0-9()@:%_\+.~#&\/=]*)*$/gi;

export default function widgets() {
  function replace(value, src, params) {
    // widget src, e.g. mob.near/widget/Profile
    if (!src) {
      return false;
    }
    // widget props, e.g. { "accountId": "root.near" }
    let props = params && params.length > 1
      ? Object.fromEntries(new URLSearchParams(params))
      : {};

    let node = { type: "text", value };

    node = {
      type: "strong",
      children: [node],
      data: {
        hProperties: {
          src,
          props,
        },
      },
    };

    return node;
  }

  function transform(markdownAST) {
    findAndReplace(markdownAST, widgetUrlRegex, replace);
    return markdownAST;
  }

  return transform;
}
