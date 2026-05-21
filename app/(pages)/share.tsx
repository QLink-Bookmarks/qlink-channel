import { type Href, Redirect } from "expo-router";

export default function SharePage() {
  return <Redirect href={"/home" as Href} />;
}
