import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";

const md = MarkdownIt();

md.use(
  await Shiki({
    themes: {
      light: "github-dark",
      dark: "github-light",
    },
  })
);

const parser = (str: string) => md.render(str);

export default parser;
