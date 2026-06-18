/* eslint-disable no-var, no-unused-vars */
var ExtensionPreprocessingJS = {
  run({ completionFunction }) {
    const meta = {};
    document.querySelectorAll("meta").forEach((el) => {
      const name = el.getAttribute("name") || el.getAttribute("property");
      const content = el.getAttribute("content");
      if (name && content) meta[name] = content;
    });
    completionFunction({
      title: document.title,
      url: document.baseURI,
      meta,
    });
  },
  finalize() {},
};
