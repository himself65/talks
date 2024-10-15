import { Chat } from "../components/chat";

export default async function HomePage() {
  return <Chat />;
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  };
};
