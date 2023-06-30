import { Affix, rem, Button, Dialog } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function AboutDialog() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Dialog
        opened={opened}
        onClose={close}
        withCloseButton
        position={{ bottom: rem(45), right: rem(30) }}
      >
        <h2>Credits & Thanks</h2>
        Thanks to the following for inspiring me and allowing me to make this
        project:
        <ul>
          <li>
            <a href="https://www.anilist.co" target="_blank">
              anilist
            </a>{" "}
            and its{" "}
            <a
              href="https://anilist.gitbook.io/anilist-apiv2-docs/"
              target="_blank"
            >
              API
            </a>
            , for providing the actual data used
          </li>
          <li>
            <a href="https://www.youtube.com/@Teeaboo" target="_blank">
              Teeaboo
            </a>{" "}
            and{" "}
            <a href="https://www.youtube.com/@Angiuss" target="_blank">
              Angius
            </a>
            , for diving into the production side of anime and inspiring me to
            make this
          </li>
          <li>
            <a href="https://www.mantine.dev" target="_blank">
              mantine
            </a>
            , for being a UI library even a back end developer like me can use
          </li>
          <li>
            <a href="https://www.npmjs.com/package/urql" target="_blank">
              urql
            </a>{" "}
            and{" "}
            <a
              href="https://www.npmjs.com/package/graphql-codegen"
              target="_blank"
            >
              graphql-codegen
            </a>
            , for making it very easy to use GraphQL with TypeScript
          </li>
          <li>
            <a href="https://www.github.com/Jomata/ani-staff" target="_blank">
              GitHub
            </a>{" "}
            and github pages, for hosting both the code and the actual page
          </li>
        </ul>
      </Dialog>
      <Affix position={{ bottom: rem(10), right: rem(30) }}>
        <Button onClick={toggle}>❔</Button>
      </Affix>
    </>
  );
}
