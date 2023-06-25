import { MantineProvider } from "@mantine/core";
import MainContainer from "./MainContainer";

export default function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <MainContainer />
    </MantineProvider>
  );
}
